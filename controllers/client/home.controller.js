const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const addNewPrice = require("../../helpers/addNewPrice");
const buildCategoryTree = require("../../helpers/buildCategoryTree");
  
// Index
module.exports.index = async (req, res) => {
  try {
    // Fetch all active categories
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
    }).sort({ position: "asc" });

    // Build category tree
    const categoryTree = buildCategoryTree(categories);

    // Fetch featured products
    const products = await Product.find({
      deleted: false,
      status: "active",
      featured: "1",
    }).sort({ position: "asc" });

    // Render view with both category tree and products
    res.render("client/pages/home/index", {
      pageTitle: "Home Page",
      categories: categoryTree,
      products: products ? addNewPrice.items(products) : [],
    });
  } catch (error) {
    console.error("Error in home controller:", error);
    res.status(500).render("client/pages/home/index", {
      pageTitle: "Home Page",
      categories: [],
      products: [],
    });
  }
};
