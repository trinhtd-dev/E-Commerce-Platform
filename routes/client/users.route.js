const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/client/users.controller");

router.get('/user-list', usersController.userList);
router.get('/friend-list', usersController.friendList);
router.get('/friend-request', usersController.friendRequest);
router.get('/sent-invitation', usersController.sentInvitation);

module.exports = router;

