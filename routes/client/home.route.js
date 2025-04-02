const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/home.controller");

router.get("/", controller.index);
router.get("/faq", controller.faq);
router.get("/contact", controller.contact);
router.get("/about", controller.about);

module.exports = router;
