const express = require("express");
const router = express.Router();

const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')

const uploadCloud = require("../../middlewares/uploadCloud.middleware.js");

const productsCategoryValudate = require("../../validates/admin/products-category.valudate.js");

const productsCategoryController = require("../../controllers/admin/products-category.controller");

router.get('/', productsCategoryController.index);

router.patch('/change-status/:status/:id/', productsCategoryController.changeStatus);

router.patch('/change-multi/', productsCategoryController.changeMulti);

router.delete('/delete-product-category/:id/', productsCategoryController.deleteProductCategory);

router.get('/create', productsCategoryController.create);

router.post('/create',
    upload.single('thumbnail'),
    uploadCloud,
    productsCategoryValudate.createPost,
    productsCategoryController.createPost
);

router.get('/edit/:id', productsCategoryController.edit);

router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud,
    productsCategoryValudate.editPost,
    productsCategoryController.editPost
);

router.get('/detail/:id', productsCategoryController.detail);

module.exports = router;