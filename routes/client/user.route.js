const express = require("express");
const router = express.Router();

const userController = require("../../controllers/client/user.controller");

router.get("/register", userController.register);

router.post("/register", userController.registerPost);

router.get("/login", userController.login);

router.post("/login", userController.loginPost);

router.get("/logout", userController.logout);

module.exports = router;