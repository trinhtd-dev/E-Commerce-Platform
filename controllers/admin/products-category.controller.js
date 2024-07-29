const productCategory = require("../../models/product-category.model");
const { request } = require("../../routes/admin/products-category.route");
const filterStatusHelpers = require("../../helpers/filterStatus");
const paginationHelpers = require("../../helpers/pagination");
const systemConfig = require("../../config/system")
const createTreeHelpers = require("../../helpers/createTree");

// [GET] /admin/products-category
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
    
    // Sorting
    let sorting = {};
    if(req.query.sorting){
        [criterial, direction] = req.query.sorting.split('-');
        sorting[criterial] = direction;  
    }
    else sorting.position = "asc";
    const sortOptions = [
        { value: 'position-asc', text: 'Increasing position' },
        { value: 'position-desc', text: 'Decreasing position' },
        { value: 'title-asc', text: 'A-Z' },
        { value: 'title-desc', text: 'Z-A' },
    ];

    //Render to view
    let records = await productCategory.find(find).sort(sorting);
    records = createTreeHelpers(records);
    const totalProducts = records.length;
    const objectPagination = paginationHelpers({
        currentPage: 1,
        limit: 10,
    }, req.query, totalProducts);
//

    const newRecord  = records.slice(objectPagination.skip,objectPagination.skip + objectPagination.limit);
   
    res.render(`admin/pages/products-category/index`, {
        title: "Category of Products",
        records: newRecord,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        sortOptions: sortOptions,
    });
};

// [PATCH] /admin/products-category/change-status/:data-status/:id
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

// [PATCH] /admin/products-category/change-status/?_method=PATCH
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

// [DETELE] /admin/products-category/delete-product/:id/?_method=DETELE
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

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const records = await productCategory.find({ deleted: false });
    res.render("admin/pages/products-category/create", {
        title: "Create Product category",
        records:  createTreeHelpers(records),
    });
};

// [POST] /admin/products-category/create
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

// [GET] /admin/products-category/fix/:id
module.exports.edit = async (req, res) => {
   try{
        const id = req.params.id;
        const record = await productCategory.findById(id);
        const records = await productCategory.find({ deleted: false });
        res.render("admin/pages/products-category/edit", {
            title: "Edit Product",
            record: record,
            records: createTreeHelpers(records),
 
        });
   }
   catch(err){
         console.log(err);
         req.flash('error', 'Product Category not found');
         res.redirect(`${systemConfig.prefixAdmin}/products-category`);
   }
};

//[PATCH] /admin/products-category/fix/:id
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

// [GET] /products-category/detail/:slug
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
 
