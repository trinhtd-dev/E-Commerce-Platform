const express = require('express');
const router = express.Router();
const authsController = require("../../controllers/admin/auths.controller");


router.get('/login', authsController.login);
router.post('/login', authsController.loginPost);
router.get('/logout', authsController.logout);

module.exports = router;