const productCategory = require("../models/product-category.model");
const createTreeHelper = require("../helpers/createTree");

/ [GET] /

module.exports.category = async (req, res, next) =>{
    const productCategories = await productCategory.find({deleted: false});
    res.locals.productCategory = createTreeHelper(productCategories);
    next();
}