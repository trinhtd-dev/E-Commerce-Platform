const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const addNewPrice = require("../../helpers/addNewPrice");

// Helper function to build category tree
const buildCategoryTree = (categories, parentId = "") => {
  const categoryTree = [];

  categories.forEach((category) => {
    // Convert MongoDB document to plain JavaScript object
    const categoryObj = category.toObject
      ? category.toObject()
      : { ...category };

    // Compare parent with parentId (both should be string for empty case or ObjectId for valid parent)
    if (String(categoryObj.parent) === String(parentId)) {
      // Find children by using current category's _id as parent
      const children = buildCategoryTree(categories, categoryObj._id);

      if (children.length > 0) {
        categoryObj.children = children;
      }

      categoryTree.push(categoryObj);
    }
  });

  return categoryTree;
};

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
