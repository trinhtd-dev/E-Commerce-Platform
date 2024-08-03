const express = require('express');
const router = express.Router();
const myAccountController = require("../../controllers/admin/my-account.controller");

const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')
const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");

const accountsValidate = require('../../validates/admin/accounts.validate.js');

router.get('/', myAccountController.index);
router.get('/edit', myAccountController.edit);
router.patch('/edit',
    upload.single('avatar'),
    uploadCloud,
    accountsValidate.editPost,
    myAccountController.editPatch);


router.get('/change-password', myAccountController.changePassword);
router.patch('/change-password', myAccountController.changePasswordPatch);

    
    

module.exports = router;