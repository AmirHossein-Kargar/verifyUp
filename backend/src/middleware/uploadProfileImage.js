const multer = require("multer");
const ApiResponse = require("../utils/response");

// Allow only image/jpeg, image/png, image/webp (image/jpg is sent as image/jpeg by browsers)
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

// Memory storage: buffer kept in req.file.buffer for encryption and MongoDB storage (no disk).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || "").toLowerCase();
  if (!ALLOWED_MIMES.includes(mime) && mime !== "image/jpg") {
    return cb(new Error("INVALID_TYPE"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

/**
 * Single file upload for profile image.
 * Field name must be "image".
 * Requires auth middleware to run first (for req.user.userId).
 */
const uploadProfileImage = upload.single("image");

/**
 * Handle multer errors and invalid type/size
 */
function handleUploadError(err, req, res, next) {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return ApiResponse.badRequest(res, {
        message: "حجم تصویر نباید بیشتر از ۲ مگابایت باشد.",
      });
    }
    if (err.message === "INVALID_TYPE") {
      return ApiResponse.badRequest(res, {
        message: "فرمت فایل مجاز نیست. فقط jpg، jpeg، png و webp مجاز است.",
      });
    }
    return next(err);
  }
  next();
}

module.exports = { uploadProfileImage, handleUploadError };
