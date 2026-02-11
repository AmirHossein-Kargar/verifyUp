const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/order.controller");
const { uploadsDir } = require("../config/uploads");

// All order routes require authentication
router.use(auth);

// Multer storage for order documents
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || "";
    cb(null, `order-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  // Strict whitelist: only specific image types and PDFs
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];

  const mimetype = (file.mimetype || "").toLowerCase();
  const ext = path.extname(file.originalname || "").toLowerCase();

  if (
    !allowedMimeTypes.includes(mimetype) ||
    !allowedExtensions.includes(ext)
  ) {
    return cb(
      new Error(
        "فرمت فایل مجاز نیست. فقط تصاویر (JPG, JPEG, PNG) یا PDF با پسوند صحیح مجاز هستند."
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

router.get("/me", ctrl.myOrders);
router.get("/:orderId", ctrl.getOrderById);
router.post("/", ctrl.createOrder);
router.post("/complete", ctrl.createPaidOrder);
router.post("/:orderId/documents", ctrl.addDocument);
router.post("/:orderId/upload", upload.single("file"), ctrl.uploadDocument);

module.exports = router;
