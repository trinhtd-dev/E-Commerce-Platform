const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/client/chat.controller");

router.get('/', chatController.index);
router.post('/', chatController.sendPost);

module.exports = router;

