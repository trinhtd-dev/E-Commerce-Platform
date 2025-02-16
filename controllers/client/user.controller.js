const User = require("../../models/user.model");
const logger = require("../../config/logger");
const ForgotPassword = require("../../models/forgot-password.model");

const sendMailHelper = require("../../helpers/send-mail");

const moment = require("moment");
const bcrypt = require("bcrypt");
const JWTService = require("../../services/jwt.service");

const saltRounds = 10;

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register");
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      req.flash("error", "Email already exists");
      return res.redirect("back");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const user = new User(req.body);

    await user.save();
    req.flash("success", "Registration successful. You can now log in");
    return res.redirect("/user/login");
  } catch (error) {
    console.log(error);
    req.flash("error", "Please try again");
    return res.redirect("back");
  }
};

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    title: "Login",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Email or password is incorrect");
      return res.redirect("back");
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.flash("error", "Email or password is incorrect");
      return res.redirect("back");
    }

    // Tạo payload cho JWT
    const payload = {
      userId: user._id,
      email: user.email,
    };

    // Tạo access token và refresh token
    const { accessToken, refreshToken } = JWTService.generateTokens(payload);

    // Lưu refresh token vào database
    user.refreshToken = refreshToken;
    await user.save();

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

    // Update user status online
    await User.updateOne({ _id: user._id }, { status_online: "online" });
    _io.sockets.emit("SERVER_LOGIN", user._id);

    // Flash message và redirect
    req.flash("success", "Login successful");
    res.redirect("/"); // hoặc dashboard tùy theo flow của bạn
  } catch (error) {
    console.error(error);
    req.flash("error", "Login failed. Please try again.");
    res.redirect("back");
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
module.exports.logout = async (req, res) => {
  try {
    // Kiểm tra user có tồn tại không trước khi truy cập
    const user = res.locals.user;
    if (!user) {
      logger.warn("Logout attempted with no user in session");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.redirect("/user/login");
    }

    // Update user status và xóa refresh token
    await User.updateOne(
      { _id: user._id },
      {
        status_online: "offline",
        refreshToken: null,
      }
    );

    // Emit socket event
    _io.sockets.emit("SERVER_LOGOUT", user._id);

    // Xóa cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    logger.info("User logged out successfully", { userId: user._id });
    req.flash("success", "Logged out successfully");
    res.redirect("/user/login");
  } catch (error) {
    logger.error("Logout error:", {
      error: error.message,
      stack: error.stack,
    });
    req.flash("error", "Logout failed");
    res.redirect("back");
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
