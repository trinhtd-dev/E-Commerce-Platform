const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const JWTService = require("../services/jwt.service");

module.exports.user = async (req, res, next) => {
  if (req.cookies.accessToken) {
    const accessToken = req.cookies.accessToken;
    const decoded = JWTService.verifyToken(accessToken);
    const user = await User.findOne({ _id: decoded.userId });
    if (user) {
      res.locals.user = user;
      await Cart.updateOne({ _id: req.cookies.cartId }, { userId: user.id });
    }
  }
  next();
};
