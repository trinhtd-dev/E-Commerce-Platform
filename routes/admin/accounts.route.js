const express = require('express');
const router = express.Router();
const accountsController = require("../../controllers/admin/accounts.controller");
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')
const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");
const accountsValidate = require("../../validates/admin/accounts.validate")
router.get('/', accountsController.index);

router.get('/create', accountsController.create);

router.post('/create',
    upload.single('avatar'),
    uploadCloud,
    accountsValidate.createPost,
    accountsController.createPost
);

router.get('/edit/:id', accountsController.edit);

router.patch('/edit/:id',
    upload.single('avatar'),
    uploadCloud,
    accountsValidate.editPost,
    accountsController.editPost
);

router.get('/detail/:id', accountsController.detail);

router.delete('/delete/:id', accountsController.delete);



module.exports = router;