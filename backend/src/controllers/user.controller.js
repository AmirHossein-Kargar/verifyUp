const mongoose = require("mongoose");
const User = require("../models/User");
const ProfileImage = require("../models/ProfileImage");
const ApiResponse = require("../utils/response");
const { encrypt, decrypt } = require("../utils/imageEncryption");
const { generateProfileImageToken, verifyProfileImageToken } = require("../utils/jwt");

/**
 * PATCH /api/users/profile-image
 * Authenticated. Multipart form field "image". Encrypts and stores in MongoDB.
 * Returns imageId and imageUrl for immediate frontend update.
 */
exports.updateProfileImage = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return ApiResponse.unauthorized(res, { message: "Unauthorized" });
    }

    const file = req.file;
    if (!file || !file.buffer) {
      return ApiResponse.badRequest(res, { message: "No image uploaded" });
    }

    const userId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return ApiResponse.badRequest(res, { message: "Invalid user id" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.notFound(res, { message: "User not found" });
    }

    const mimeType = (file.mimetype || "").toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType) && mimeType !== "image/jpg") {
      return ApiResponse.badRequest(res, { message: "Invalid file type. Allowed: jpg, png, webp" });
    }

    const normalizedMime = mimeType === "image/jpg" ? "image/jpeg" : mimeType;

    let encrypted;
    try {
      encrypted = encrypt(file.buffer);
    } catch (err) {
      return ApiResponse.serverError(res, {
        message: "Encryption not configured. Set IMAGE_ENCRYPTION_KEY.",
      });
    }

    const doc = await ProfileImage.create({
      userId: user._id,
      encryptedData: encrypted.encrypted,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      mimeType: normalizedMime,
    });

    const imageId = doc._id.toString();
    const imageUrl = `/api/users/profile-image/${imageId}`;
    const imageToken = generateProfileImageToken(userId, imageId);

    if (user.profileImageId) {
      await ProfileImage.findByIdAndDelete(user.profileImageId).catch(() => {});
    }

    user.profileImage = imageUrl;
    user.profileImageId = doc._id;
    await user.save();

    const payload = {
      imageId,
      imageUrl,
      imageToken,
      profileImage: imageUrl,
    };
    if (process.env.NODE_ENV !== "production") {
      console.info("[Profile image] Upload success:", { userId, imageId, hasToken: !!imageToken });
    }
    return ApiResponse.success(res, {
      message: "Profile image updated successfully",
      data: payload,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Ensure value is a Node Buffer (Mongoose .lean() returns { type: 'Buffer', data: [...] }).
 */
function ensureBuffer(v) {
  if (Buffer.isBuffer(v)) return v;
  if (v && typeof v === "object" && Array.isArray(v.data)) return Buffer.from(v.data);
  if (v && typeof v === "object" && v.type === "Buffer" && Array.isArray(v.data)) return Buffer.from(v.data);
  return Buffer.from(v || []);
}

/**
 * GET /api/users/profile-image/:id
 * Auth via cookie (req.user) or query.token (JWT). Decrypts and returns raw image.
 */
exports.getProfileImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return ApiResponse.notFound(res, { message: "Image not found" });
    }

    let userId;
    const token = req.query.token;
    if (token) {
      const decoded = verifyProfileImageToken(token);
      if (!decoded || decoded.imageId !== id) {
        return ApiResponse.unauthorized(res, { message: "Invalid or expired token" });
      }
      userId = decoded.userId;
    } else if (req.user && req.user.userId) {
      userId = req.user.userId;
    } else {
      return ApiResponse.unauthorized(res, { message: "Unauthorized" });
    }

    // Do not use .lean() so Mongoose returns real Buffers; fallback ensureBuffer for safety
    const doc = await ProfileImage.findById(id);
    if (!doc) {
      return ApiResponse.notFound(res, { message: "Image not found" });
    }

    if (doc.userId.toString() !== userId) {
      return ApiResponse.forbidden(res, { message: "Access denied" });
    }

    const enc = ensureBuffer(doc.encryptedData);
    const iv = ensureBuffer(doc.iv);
    const tag = ensureBuffer(doc.authTag);
    if (!enc.length || iv.length !== 16 || tag.length !== 16) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Profile image: invalid stored data (enc/iv/tag length)");
      }
      return ApiResponse.notFound(res, { message: "Image data invalid; please re-upload profile image" });
    }

    let buffer;
    try {
      buffer = decrypt(enc, iv, tag);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Profile image decrypt error:", err?.message || err);
      }
      return ApiResponse.notFound(res, {
        message: "Image could not be loaded. Please re-upload your profile image from the profile page.",
      });
    }

    const mimeType = doc.mimeType || "image/jpeg";
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Cache-Control", "private, max-age=31536000");
    res.send(buffer);
  } catch (err) {
    if (!res.headersSent) next(err);
  }
};
