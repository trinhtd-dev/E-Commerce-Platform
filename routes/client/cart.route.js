const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/client/cart.controller");

router.get("/", cartController.index);
router.post("/add", cartController.addPost);
router.get("/update/:productId", cartController.update);
router.get("/delete/:productId", cartController.delete);
router.post("/pre-order", cartController.preOrder);

module.exports = router;
