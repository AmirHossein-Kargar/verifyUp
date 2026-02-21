const router = require("express").Router();
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const { uploadProfileImage, handleUploadError } = require("../middleware/uploadProfileImage");
const { updateProfile, updateProfileImage, getProfileImage } = require("../controllers/user.controller");

router.patch("/profile", auth, updateProfile);

router.patch(
  "/profile-image",
  auth,
  (req, res, next) => {
    uploadProfileImage(req, res, (err) => {
      handleUploadError(err, req, res, next);
    });
  },
  updateProfileImage
);

router.get("/profile-image/:id", optionalAuth, getProfileImage);

module.exports = router;
