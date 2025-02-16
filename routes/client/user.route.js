const express = require("express");
const router = express.Router();

const userController = require("../../controllers/client/user.controller");

const userAuthenticationMiddleware = require("../../middlewares/user-authentication.middleware");

//upload image
const multer = require("multer");
const upload = multer();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");

const authenticationValidate = require("../../validates/client/authentication.validate");
const forgotPasswordValidate = require("../../validates/client/forgot-password.validate");

router.get("/register", userController.register);

router.post(
  "/register",
  authenticationValidate.register,
  userController.registerPost
);

router.get("/login", userController.login);

router.post("/login", authenticationValidate.login, userController.loginPost);

router.get("/logout", userController.logout);

// Forgot Password

router.use("/password", userAuthenticationMiddleware.requireAuth); //Add middleware

router.get("/password/forgot", userController.passwordForgot);

router.post(
  "/password/forgot",
  forgotPasswordValidate.forgot,
  userController.passwordForgotPost
);

router.get("/password/otp/:email", userController.passwordOtp);

router.post(
  "/password/otp",
  forgotPasswordValidate.otp,
  userController.passwordOtpPost
);

router.get("/password/reset", userController.passwordReset);

router.post(
  "/password/reset",
  forgotPasswordValidate.reset,
  userController.passwordResetPost
);

router.get("/profile", userController.profile);

router.get("/profile/edit", userController.profileEdit);

router.patch(
  "/profile/edit",
  upload.single("avatar"),
  uploadCloud,
  userController.profileEditPatch
);

router.post("/refresh-token", userController.refreshToken);

module.exports = router;
