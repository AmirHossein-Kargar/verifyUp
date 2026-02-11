const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/order.controller");

// All order routes require authentication
router.use(auth);

// Multer storage for order documents
const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || "";
    cb(null, `order-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  // Basic whitelist: images and PDFs
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("فرمت فایل مجاز نیست. فقط تصویر یا PDF مجاز است."));
  }
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
