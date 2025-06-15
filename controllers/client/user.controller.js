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
    title: "Forgot Password",
  });
};

// [POST] /user/password/forgot
module.exports.passwordForgotPost = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    req.flash("error", "Please enter your email");
    return res.redirect("back");
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Email is not registered");
      return res.redirect("back");
    }

    const forgotPassword = new ForgotPassword({ email });
    await forgotPassword.save();

    // Send OTP to user's email
    const subject = "OTP Verification";
    const html = `<h1>Your OTP code is ${forgotPassword.otp}. Your OTP code is expired after 3 minutes.</h1>`;
    sendMailHelper.sendMail(email, subject, html);
    //...

    req.flash("success", "OTP sent to your email");
    res.redirect(`/user/password/otp/${user.email}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred, please try again");
    res.redirect("/user/login");
  }
};

// [GET] /user/password/otp
module.exports.passwordOtp = (req, res) => {
  res.render("client/pages/user/password-otp", {
    title: "OTP",
    email: req.params.email,
  });
};

// [POST] /user/password/otp
module.exports.passwordOtpPost = async (req, res) => {
  const { email, otp } = req.body;
  const forgotPassword = new ForgotPassword({ email: email });
  try {
    if (!forgotPassword) {
      req.flash("error", "Email is incorrect");
      return res.redirect("back");
    }

    if (otp !== forgotPassword.otp) {
      req.flash("error", "OTP is incorrect");
      return res.redirect(`/user/password/otp/${email}`);
    }

    const user = await User.findOne({ email: email });
    const expires = 1000 * 60 * 60 * 24 * 365; // 1 year
    res.cookie("userToken", user.token, {
      expires: new Date(Date.now() + expires),
    });
    await ForgotPassword.deleteOne({ email });

    res.redirect("/user/password/reset");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred, please try again");
    res.redirect("/user/login");
  }
};

// [GET] /user/password/reset
module.exports.passwordReset = (req, res) => {
  res.render("client/pages/user/password-reset", {
    title: "Reset Password",
  });
};

// [POST] /user/password/reset
module.exports.passwordResetPost = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  try {
    const userToken = req.cookies.userToken;
    await User.updateOne(
      { token: userToken },
      { password: bcrypt.hashSync(newPassword, saltRounds) }
    );
    req.flash("success", "Password reset successful");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "Please try again");
    return res.redirect("user/login");
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
