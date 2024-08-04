const Product = require("../../models/product.model");


module.exports.index = async (req, res) => {
    let keyword = ""; 
    if(!req.query.keyword){
        res.redirect('back');
        return;
    }
    keyword = req.query.keyword;
    const regexKeyword = new RegExp(keyword, "i");

    const products = await Product.find({
        deleted: false,
        title: regexKeyword,
        status: "active",
    }).sort("position ASC");

    res.render("client/pages/search/index", {
        title: "Results for search",
        products: products,
        keyword: keyword,
    });
 };
 
 