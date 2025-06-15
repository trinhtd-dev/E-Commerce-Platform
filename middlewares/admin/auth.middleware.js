const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.isAuthenticated = async (req, res, next) => {
  // Bỏ qua check cho trang login để tránh vòng lặp vô hạn
  if (req.originalUrl.includes(`${systemConfig.prefixAdmin}/auth/login`)) {
    return next();
  }

  const token = req.cookies.token;

  if (!token) {
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }

  try {
    const user = await Account.findOne({ token: token }).select("-password");

    if (!user) {
      res.clearCookie("token");
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }

    const role = await Role.findOne({ _id: user.role });
    res.locals.user = user;
    res.locals.role = role;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
};

module.exports.forwardAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    // Nếu đã đăng nhập, chuyển hướng đến dashboard
    return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
  // Nếu chưa đăng nhập, cho phép tiếp tục
  next();
};
