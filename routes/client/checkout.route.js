const express = require("express");
const router = express.Router();
const checkcoutController = require("../../controllers/client/checkout.controller");

router.get('/', checkcoutController.index);
router.post('/orders', checkcoutController.order);

module.exports = router;

