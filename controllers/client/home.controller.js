const Product = require("../../models/product.model");

const addNewPrice = require("../../helpers/addNewPrice")
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        featured: "1",
    }).sort("position ASC");

    res.render("client/pages/home/index", {
        title: "HOME",
        products: addNewPrice.items(products),
    });
 };
 
 