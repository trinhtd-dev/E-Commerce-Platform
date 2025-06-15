const Product = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");

const { request } = require("../../routes/admin/products.route");
const filterStatusHelpers = require("../../helpers/filterStatus");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const buildCategoryTree = require("../../helpers/buildCategoryTree");
const moment = require("moment");
const Account = require("../../models/account.model");
const ProductService = require("../../services/product.service");

// [GET] /admin/products
module.exports.index = async (req, res, next) => {
  try {
    const { products, pagination, filterStatus, keyword } =
      await ProductService.getProducts(req.query);

    const sortOptions = [
      { value: "position-asc", text: "Increasing position" },
      { value: "position-desc", text: "Decreasing position" },
      { value: "title-asc", text: "A-Z" },
      { value: "title-desc", text: "Z-A" },
      { value: "price-asc", text: "Increasing price" },
      { value: "price-desc", text: "Decreasing price" },
    ];

    res.render("admin/pages/products/index", {
      title: "Products List",
      products,
      filterStatus,
      keyword,
      pagination,
      sortOptions,
      moment,
    });
  } catch (error) {
    next(error);
  }
};

// [PATCH] /admin/products/change-status/:data-status/:id
module.exports.changeStatus = async (req, res, next) => {
  try {
    const { status, id } = req.params;
    const userId = res.locals.user.id;
    await ProductService.changeStatus(id, status, userId);
    req.flash("success", "Thay đổi trạng thái thành công!");
  } catch (error) {
    req.flash("error", "Thay đổi trạng thái thất bại!");
    // (Optional) Log the full error for debugging
    // logger.error(error);
  }
  res.redirect("back");
};

// [PATCH] /admin/products/change-status/?_method=PATCH
module.exports.changeMulti = async (req, res, next) => {
  try {
    const { type, ids } = req.body;
    const idsArray = ids.split(",");
    const userId = res.locals.user.id;
    await ProductService.changeMulti(type, idsArray, userId);
    req.flash("success", `Đã cập nhật ${idsArray.length} sản phẩm thành công!`);
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }
  res.redirect("back");
};

// [DETELE] /admin/products/delete-product/:id/?_method=DETELE
module.exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = res.locals.user.id;
    await ProductService.deleteProduct(productId, userId);
    req.flash("success", "Xóa sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Xóa sản phẩm thất bại!");
  }
  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const categories = await productCategory.find({});
  res.render("admin/pages/products/create", {
    title: "Create Product",
    categories: buildCategoryTree(categories),
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    await ProductService.createProduct(req.body, userId);
    req.flash("success", "Tạo sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    req.flash("error", "Tạo sản phẩm thất bại!");
    res.redirect("back");
  }
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await productCategory.find({});
    res.render("admin/pages/products/edit", {
      title: "Edit Product",
      product,
      categories: buildCategoryTree(categories),
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = res.locals.user.id;
    await ProductService.updateProduct(productId, req.body, userId);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
    res.redirect("back");
  }
};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.render("admin/pages/products/detail", {
      title: product.title,
      product: product,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Product not found");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
