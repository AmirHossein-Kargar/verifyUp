const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/order.controller");

// All order routes require authentication
router.use(auth);

router.get("/me", ctrl.myOrders);
router.get("/:orderId", ctrl.getOrderById);
router.post("/", ctrl.createOrder);
router.post("/:orderId/documents", ctrl.addDocument);

module.exports = router;
