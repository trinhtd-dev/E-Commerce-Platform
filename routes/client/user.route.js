const express = require("express");
const router = express.Router();

const userController = require("../../controllers/client/user.controller");

router.get("/register", userController.register);

router.post("/register", userController.registerPost);

router.get("/login", userController.login);

router.post("/login", userController.loginPost);

router.get("/logout", userController.logout);


// Forgot Password
router.get("/password/forgot", userController.passwordForgot);

router.post("/password/forgot", userController.passwordForgotPost);

router.get("/password/otp/:email", userController.passwordOtp);

router.post("/password/otp", userController.passwordOtpPost);

router.get("/password/reset", userController.passwordReset);

router.post("/password/reset", userController.passwordResetPost);



module.exports = router;