const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
} = require("../validators/auth.validation");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/profile", protect, getProfile);

module.exports = router;
