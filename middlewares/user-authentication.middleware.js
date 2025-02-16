const User = require("../models/user.model");
const JWTService = require("../services/jwt.service");

module.exports.requireAuth = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.redirect("/user/login");
    }

    // Verify token
    const decoded = JWTService.verifyToken(accessToken);
    if (!decoded) {
      // Thử refresh token
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.redirect("/user/login");
      }

      // Redirect để refresh token
      return res.redirect("/user/refresh-token");
    }

    // Tìm user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.redirect("/user/login");
    }

    // Gán user vào request
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/user/login");
  }
};
