const productCategory = require("../models/product-category.model");
const buildCategoryTree = require("../helpers/buildCategoryTree");

// [GET] /

module.exports.category = async (req, res, next) => {
  const productCategories = await productCategory.find({ deleted: false });
  res.locals.productCategories = buildCategoryTree(productCategories);
  next();
};
