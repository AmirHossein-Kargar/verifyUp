const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
} = require("../controllers/order.controller");
const { protect } = require("../middleware/auth");
const { validateOrder } = require("../validators/order.validation");

router.post("/", protect, validateOrder, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
