const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ctrl = require("../controllers/admin.controller");

// All admin routes require authentication and admin role
router.use(auth, admin);

// Statistics
router.get("/stats", ctrl.getStats);

// Orders management
router.get("/orders", ctrl.listOrders);
router.get("/orders/:orderId", ctrl.getOrderDetails);
router.get("/orders/:orderId/documents", ctrl.orderDocs);
router.patch("/orders/:orderId/status", ctrl.updateOrderStatus);

// Document review
router.patch("/documents/:docId/review", ctrl.reviewDoc);

module.exports = router;
