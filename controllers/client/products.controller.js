// [GET] /products

const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };
    

    const products = await Product.find(find).sort("position ASC");

    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
        return item;
    })

    res.render('client/pages/products/index', {
        title: 'Products',
        products: newProducts
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
 