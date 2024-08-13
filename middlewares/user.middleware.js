const User = require("../models/user.model");
const Cart = require("../models/cart.model");

module.exports.user = async (req, res, next)  => {
    if(req.cookies.userToken){
        const user = await User.findOne({token: req.cookies.userToken});
        if(user){
            res.locals.user = user;
            await Cart.updateOne({_id: req.cookies.cartId}, {userId: user.id});
        }
    }
    next();
}