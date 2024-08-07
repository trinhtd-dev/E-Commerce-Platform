const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/client/cart.controller");

router.get('/', cartController.index);
router.post('/add/:productId', cartController.addPost);
router.get('/update/:productId', cartController.update);
router.get('/delete/:productId', cartController.delete);

module.exports = router;

