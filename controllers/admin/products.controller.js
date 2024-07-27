const Product = require("../../models/product.model");
const { request } = require("../../routes/admin/products.route");
const filterStatusHelpers = require("../../helpers/filterStatus");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/system")

// [GET] /admin/products
module.exports.index = async (req, res) => {
// Filter data
    let find = {
        deleted: false
    };
// Filter products

    if(req.query.status)
        find.status = req.query.status; 
    const filterStatus = filterStatusHelpers(req.query);
        
// Search for products
    const searchHelpers = require("../../helpers/search");
    const objectSearch =  searchHelpers(req.query);
    if(req.query.keyword){
        find.title = objectSearch.regex;
    }

// Pagination
    const totalProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelpers({
        currentPage: 1,
        limit: 5,
    }, req.query, totalProducts);

//
    // Sorting
    let sorting = {};
    if(req.query.sorting){
        [criterial, direction] = req.query.sorting.split('-');
        sorting[criterial] = direction;  
    }
    else sorting.positon = "asc";
    
    //Render to view 
    const products = await Product.find(find)
        .sort(sorting)
        .limit(objectPagination.limit)
        .skip(objectPagination.skip);

    res.render(`admin/pages/products/index`, {
        title: "Products List",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        sorting: sorting,
    });
};

// [PATCH] /admin/products/change-status/:data-status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    try {
        await Product.updateOne({ _id: id }, { status: status });
        req.flash("success", "Change status successfully");
    } catch (error) {
        req.flash("error", "Change status failed");
        
    }
    res.redirect("back");

};

// [PATCH] /admin/products/change-status/?_method=PATCH
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(',');
    switch(req.body.type){
        case "active":
            try {
                await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
                req.flash("success", `Change status for ${ids.length} products successfully`);
            } catch (error) {
                req.flash("error", `Change status for ${ids.length} products failed`);
            }
            break;

        case "inactive":
            try {
                await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
                req.flash("success", `Change status for ${ids.length} products successfully`);
            } catch (error) {
                req.flash("error", `Change status for ${ids.length} products failed`);
            }
            break;
        case "delete":
            try {
                await Product.updateMany({ _id: { $in: ids } },
                    { deleted: true,
                       deletedAt: new Date()
                     });
               req.flash("success", `Deleted ${ids.length} products successfully`);
            } catch (error) {
                req.flash("error", `Delete ${ids.length} products failed`);
                
            }
            break;

        case "change-position":
            try {
                for (const item of ids) {
                    [id, position] = item.split("-");
                    await Product.updateOne({_id: id}, {position: parseInt(position)});
                }
                req.flash("success", `Change position for ${ids.length} products successfully`);
            } catch (error) {
                req.flash("error", `Change position for ${ids.length} products failed`);
                
            }
            break;
    }

    res.redirect("back");

};

// [DETELE] /admin/products/delete-product/:id/?_method=DETELE
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
   try {
    await Product.updateOne({ _id: id }, 
        {   
            deleted: true,
            deletedAt: new Date()
        });
        req.flash("success", `Deleted product successfully`);
   } catch (error) {
     req.flash("error", `Deleted product failed`);
   }
    res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        title: "Create Product",
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
// change to correct data type   
    if(req.body.price) req.body.price = parseFloat(req.body.price);
    if(req.body.stock) req.body.stock = parseInt(req.body.stock);
    if(req.body.discountPercentage) req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    if(req.body.position) req.body.position = parseInt(req.body.position);
    if(!req.body.position){
        req.body.position = await Product.countDocuments({}) + 1;
    }
    else req.body.position = parseInt(req.body.position);

    const product = new Product(req.body);

    try {
        await product.save();
        req.flash('success', 'Create product successfully');
    } catch (error) {
        console.log(error);
        req.flash('error', "Create product failed");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`);

};

// [GET] /admin/products/fix/:id
module.exports.edit = async (req, res) => {
   try{
        const id = req.params.id;
        const product = await Product.findById(id);
        res.render("admin/pages/products/edit", {
            title: "Edit Product",
            product: product,
        });
   }
   catch(err){
         console.log(err);
         req.flash('error', 'Product not found');
         res.redirect(`${systemConfig.prefixAdmin}/products`);
   }
};

//[PATCH] /admin/products/fix/:id
module.exports.editPost = async (req, res) => {
    if(req.body.price) req.body.price = parseFloat(req.body.price);
    if(req.body.stock) req.body.stock = parseInt(req.body.stock);
    if(req.body.discountPercentage) req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    if(!req.body.position){
        req.body.position = await Product.countDocuments({}) + 1;
    }
    else req.body.position = parseInt(req.body.position);

    const id = req.params.id;
    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash('success', 'Update product successfully');

    } catch (error) {
        req.flash('error', 'Update product failed');
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`);

};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try{
         const id = req.params.id;
         const product = await Product.findById(id);
         res.render("admin/pages/products/detail", {
             title: product.title,
             product: product,
         });
    }
    catch(err){
          console.log(err);
          req.flash('error', 'Product not found');
          res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
 };
 
