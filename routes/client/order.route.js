const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/client/order.controller");
router.get("/", orderController.index);

module.exports = router;
