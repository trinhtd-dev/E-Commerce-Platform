const express = require("express");
const router = express.Router();

const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')

const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");

const productsValudate = require("../../validates/admin/products.valudate.js");

const productsController = require("../../controllers/admin/products.controller");

router.get('/', productsController.index);

router.patch('/change-status/:status/:id/', productsController.changeStatus);

router.patch('/change-multi/', productsController.changeMulti);

router.delete('/delete-product/:id/', productsController.deleteProduct);

router.get('/create', productsController.create);

router.post('/create',
    upload.single('thumbnail'),
    uploadCloud,
    productsValudate.createPost,
    productsController.createPost
);

router.get('/edit/:id', productsController.edit);

router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud,
    productsValudate.editPost,
    productsController.editPost
);

router.get('/detail/:id', productsController.detail);

module.exports = router;