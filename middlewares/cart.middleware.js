const Cart = require("../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        const expires = 1000 * 60 * 60 * 24 * 365; // 1 year in milliseconds
        res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expires) });
    } else {
        const cart = await Cart.findOne({ _id: req.cookies.cartId });
        if (cart) {
            cart.totalProduct = cart.products.reduce((sum, item) => sum + item.quantity, 0);
            res.locals.cart = cart;
        }
    }
    next();
};