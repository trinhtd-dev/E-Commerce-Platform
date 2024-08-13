const express = require('express');
const router = express.Router();
const generalSettingController = require("../../controllers/admin/general-setting.controller");


const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')
const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");

router.get('/', generalSettingController.index);

router.patch('/',
     upload.single('logo'),
     uploadCloud,
     generalSettingController.indexPatch
);

module.exports = router;