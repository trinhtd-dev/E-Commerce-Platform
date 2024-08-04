const Product = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");

const addNewPrice = require("../../helpers/addNewPrice")

// [GET] /products
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };

    const products = await Product.find(find).sort("position ASC");

    res.render('client/pages/products/index', {
        title: 'Products',
        products: addNewPrice.items(products),
    });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try{
        let find = {
            deleted: false,
            slug: req.params.slug,
            status: "active",
        }
        const id = req.params.slug;
        const product = await Product.findOne(find);
        product.newPrice = (product.price * (100 - product.discountPercentage) / 100).toFixed(2);

        res.render("client/pages/products/detail", {
            title: product.title,
            product: product,
        });
    }
    catch(err){
          console.log(err);
          req.flash('error', 'Product not found');
          res.redirect(`/products`);
    }
 };
 
// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    
        const slugCategory= req.params.slugCategory;
        
        const category = await productCategory.findOne({
            slug: slugCategory,
            deleted: false,
        });

        if(!category){
            req.flash('error', 'Category not found');
            res.redirect(`/products`);
            return;
        }

        let allCategories = [category];
        const getAllCategories = async (category) => {

            const children = await productCategory.find({
                parent: category._id,
                deleted: false,
            });

            if (children.length > 0) {
                allCategories = allCategories.concat(children);
                for (const child of children) {
                    await getAllCategories(child);
                }
            }
        };
        await getAllCategories(category);

        let find = {
            deleted: false,
            productCategoryId: { $in: allCategories.map(c => c._id) },
        };

        const products = await Product.find(find).sort("position ASC");

        res.render("client/pages/products", {
            title: category.title,
            products: products,
        });
    
 };
 

 