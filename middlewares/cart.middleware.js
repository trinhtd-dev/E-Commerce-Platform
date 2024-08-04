const Cart = require("../models/cart.models");

module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();
        const expires = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart.id, new Date(Date.now() + expires));
    }
    next();
};