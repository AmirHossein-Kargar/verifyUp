const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/admin.controller");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

router.get("/users", protect, admin, getAllUsers);
router.get("/orders", protect, admin, getAllOrders);
router.put("/orders/:id", protect, admin, updateOrderStatus);

module.exports = router;
