const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/client/chat.controller");

router.get('/', chatController.rooms);
router.get('/room/:roomId', chatController.chat);
router.post('/create-group', chatController.createGroup);


module.exports = router;

