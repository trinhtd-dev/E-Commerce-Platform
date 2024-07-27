const productCategory = require("../../models/product-category");
const { request } = require("../../routes/admin/products-category.route");
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
    const totalProducts = await productCategory.countDocuments(find);
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
    const sortOptions = [
        { value: 'position-asc', text: 'Increasing position' },
        { value: 'position-desc', text: 'Decreasing position' },
        { value: 'title-asc', text: 'A-Z' },
        { value: 'title-desc', text: 'Z-A' },
    ];

    //Render to view 
    const records = await productCategory.find(find)
        .sort(sorting)
        .limit(objectPagination.limit)
        .skip(objectPagination.skip);

    res.render(`admin/pages/products-category/index`, {
        title: "Category of Products",
        records: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        sortOptions: sortOptions,
    });
};

// [PATCH] /admin/products/change-status/:data-status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    try {
        await productCategory.updateOne({ _id: id }, { status: status });
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
                await productCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
                req.flash("success", `Change status for ${ids.length} product categories successfully`);
            } catch (error) {
                req.flash("error", `Change status for ${ids.length} product categories failed`);
            }
            break;

        case "inactive":
            try {
                await productCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });
                req.flash("success", `Change status for ${ids.length} product categories successfully`);
            } catch (error) {
                req.flash("error", `Change status for ${ids.length} product categories failed`);
            }
            break;
        case "delete":
            try {
                await productCategory.updateMany({ _id: { $in: ids } },
                    { deleted: true,
                       deletedAt: new Date()
                     });
               req.flash("success", `Deleted ${ids.length} product categories successfully`);
            } catch (error) {
                req.flash("error", `Delete ${ids.length} product categories failed`);
                
            }
            break;

        case "change-position":
            try {
                for (const item of ids) {
                    [id, position] = item.split("-");
                    await productCategory.updateOne({_id: id}, {position: parseInt(position)});
                }
                req.flash("success", `Change position for ${ids.length} product categories successfully`);
            } catch (error) {
                req.flash("error", `Change position for ${ids.length} product categories failed`);
                
            }
            break;
    }

    res.redirect("back");

};

// [DETELE] /admin/products/delete-product/:id/?_method=DETELE
module.exports.deleteProductCategory = async (req, res) => {
    const id = req.params.id;
   try {
    await productCategory.updateOne({ _id: id }, 
        {   
            deleted: true,
            deletedAt: new Date()
        });
        req.flash("success", `Deleted product category successfully`);
   } catch (error) {
     req.flash("error", `Deleted product category failed`);
   }
    res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create", {
        title: "Create Product category",
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
// change to correct data type   
    if(req.body.position) req.body.position = parseInt(req.body.position);
    if(!req.body.position){
        req.body.position = await productCategory.countDocuments({}) + 1;
    }
    else req.body.position = parseInt(req.body.position);

    const record = new productCategory(req.body);

    try {
        await record.save();
        req.flash('success', 'Create product category successfully');
    } catch (error) {
        console.log(error);
        req.flash('error', "Create product category failed");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);

};

// [GET] /admin/products/fix/:id
module.exports.edit = async (req, res) => {
   try{
        const id = req.params.id;
        const record = await productCategory.findById(id);
        res.render("admin/pages/products-category/edit", {
            title: "Edit Product",
            record: record,
        });
   }
   catch(err){
         console.log(err);
         req.flash('error', 'Product Category not found');
         res.redirect(`${systemConfig.prefixAdmin}/products-category`);
   }
};

//[PATCH] /admin/products/fix/:id
module.exports.editPost = async (req, res) => {
    if(!req.body.position){
        req.body.position = await productCategory.countDocuments({}) + 1;
    }
    else req.body.position = parseInt(req.body.position);

    const id = req.params.id;
    try {
        await productCategory.updateOne({ _id: id }, req.body);
        req.flash('success', 'Update product category successfully');

    } catch (error) {
        req.flash('error', 'Update product category failed');
    }
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);

};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try{
         const id = req.params.id;
         const record = await productCategory.findById(id);
         res.render("admin/pages/products-category/detail", {
             title: record.title,
             record: record,
         });
    }
    catch(err){
          console.log(err);
          req.flash('error', 'Product category not found');
          res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
 };
 
