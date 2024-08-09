const express = require("express");
const router = express.Router();
const checkcoutController = require("../../controllers/client/checkout.controller");

router.get('/', checkcoutController.index);
router.post('/orders', checkcoutController.order);
router.get('/success/:orderId', checkcoutController.success);

module.exports = router;

