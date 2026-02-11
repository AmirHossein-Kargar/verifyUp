const router = require("express").Router();
const fs = require("fs");
const path = require("path");

const auth = require("../middleware/auth");
const Document = require("../models/Document");
const ApiResponse = require("../utils/response");
const { uploadsDir } = require("../config/uploads");

// Legacy uploads directory used before private storage refactor.
// Kept as a fallback so older documents remain accessible if needed.
const legacyUploadsDir = path.join(__dirname, "..", "..", "uploads");

router.use(auth);

router.get("/:documentId", async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const doc = await Document.findById(documentId);
    if (!doc) {
      return ApiResponse.notFound(res, {
        message: "مدرک یافت نشد",
      });
    }

    const isOwner =
      doc.userId && doc.userId.toString() === req.user.userId?.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return ApiResponse.forbidden(res, {
        message: "دسترسی به این مدرک برای شما مجاز نیست",
      });
    }

    // Determine file path: prefer explicit storagePath, then fileName in the
    // new private uploads directory, finally fall back to legacy location.
    let filePath = doc.storagePath;

    if (!filePath && doc.fileName) {
      filePath = path.join(uploadsDir, doc.fileName);
    }

    if (!filePath && doc.fileUrl) {
      const baseName = path.basename(doc.fileUrl);
      if (baseName && baseName !== "/" && baseName !== "\\") {
        filePath = path.join(legacyUploadsDir, baseName);
      }
    }

    if (!filePath) {
      return ApiResponse.notFound(res, {
        message: "فایل مربوط به این مدرک یافت نشد",
      });
    }

    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      return ApiResponse.notFound(res, {
        message: "فایل مربوط به این مدرک یافت نشد",
      });
    }

    const downloadName = doc.fileName || path.basename(filePath);
    return res.download(filePath, downloadName);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
