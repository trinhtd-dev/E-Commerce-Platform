const User = require("../../models/user.model");
const logger = require("../../config/logger");
const ForgotPassword = require("../../models/forgot-password.model");

const sendMailHelper = require("../../helpers/send-mail");

const moment = require("moment");
const bcrypt = require("bcrypt");
const JWTService = require("../../services/jwt.service");
const UserService = require("../../services/user.service");
const AuthService = require("../../services/auth.service");

const saltRounds = 10;

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register");
};

// [POST] /user/register
module.exports.registerPost = async (req, res, next) => {
  try {
    await UserService.register(req.body);
    req.flash(
      "success",
      "Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ."
    );
    return res.redirect("/user/login");
  } catch (error) {
    // Nếu lỗi có statusCode (ví dụ: 409 cho email tồn tại), hiển thị thông báo cụ thể
    if (error.statusCode) {
      req.flash("error", error.message);
      return res.redirect("back");
    }
    // Chuyển các lỗi không mong muốn khác cho middleware xử lý lỗi trung tâm
    next(error);
  }
};

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    title: "Login",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );

    // Lưu tokens vào cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    if (error.statusCode) {
      req.flash("error", error.message);
      return res.redirect("back");
    }
    next(error);
  }
};

// [POST] /user/refresh-token
module.exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.redirect("/user/login");
    }

    // Tạo token mới
    const tokens = JWTService.refreshAccessToken(refreshToken);
    if (!tokens) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.redirect("/user/login");
    }

    // Cập nhật cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect về trang hiện tại
    res.redirect("back");
  } catch (error) {
    console.error(error);
    res.redirect("/user/login");
  }
};

// [POST] /user/logout
module.exports.logout = async (req, res, next) => {
  try {
    await AuthService.logout(res.locals.user);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    req.flash("success", "Đăng xuất thành công");
    res.redirect("/user/login");
  } catch (error) {
    next(error);
  }
};

// [GET] /user/password/forgot
module.exports.passwordForgot = (req, res) => {
  res.render("client/pages/user/password-forgot", {
    title: "Quên Mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.passwordForgotPost = async (req, res, next) => {
  try {
    const user = await AuthService.handleForgotPassword(req.body.email);
    req.flash("success", "Mã OTP đã được gửi đến email của bạn.");
    res.redirect(`/user/password/otp?email=${user.email}`);
  } catch (error) {
    if (error.statusCode) {
      req.flash("error", error.message);
      return res.redirect("back");
    }
    next(error);
  }
};

// [GET] /user/password/otp
module.exports.passwordOtp = (req, res) => {
  res.render("client/pages/user/password-otp", {
    title: "Nhập mã OTP",
    email: req.query.email,
  });
};

// [POST] /user/password/otp
module.exports.passwordOtpPost = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyOtp(email, otp);
    res.redirect(`/user/password/reset?email=${email}&otp=${otp}`);
  } catch (error) {
    if (error.statusCode) {
      req.flash("error", error.message);
      return res.redirect("back");
    }
    next(error);
  }
};

// [GET] /user/password/reset
module.exports.passwordReset = (req, res) => {
  res.render("client/pages/user/password-reset", {
    title: "Đặt lại mật khẩu",
    email: req.query.email,
    otp: req.query.otp,
  });
};

// [POST] /user/password/reset
module.exports.passwordResetPost = async (req, res, next) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("error", "Mật khẩu xác nhận không khớp.");
      return res.redirect("back");
    }

    // Xác thực lại OTP trước khi reset để tăng bảo mật
    await AuthService.verifyOtp(email, otp);
    await AuthService.resetPassword(email, password);

    req.flash(
      "success",
      "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ."
    );
    res.redirect("/user/login");
  } catch (error) {
    if (error.statusCode) {
      req.flash("error", error.message);
      return res.redirect("back");
    }
    next(error);
  }
};

// [GET] /user/profile
module.exports.profile = (req, res) => {
  res.render("client/pages/user/profile", {
    title: res.locals.user.fullName,
    moment: moment,
  });
};

// [GET] /user/profile/edit
module.exports.profileEdit = (req, res) => {
  res.render("client/pages/user/profile-edit", {
    title: res.locals.user.fullName,
    moment: moment,
  });
};

// [PATCH] /user/profile/edit
module.exports.profileEditPatch = async (req, res) => {
  try {
    const userToken = req.cookies.userToken;
    await User.updateOne({ token: userToken }, req.body);
    req.flash("success", "User updated successfully");
    res.redirect("/user/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Please try again");
    res.redirect("/user/profile");
  }
};
