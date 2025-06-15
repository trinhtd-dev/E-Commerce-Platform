const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const JWTService = require("./jwt.service");
const logger = require("../config/logger");
const ForgotPassword = require("../models/forgot-password.model");
const sendMailHelper = require("../helpers/send-mail");

const saltRounds = 10;

class AuthService {
  /**
   * Xác thực người dùng và tạo tokens.
   * @param {string} email - Email của người dùng.
   * @param {string} password - Mật khẩu của người dùng.
   * @returns {Promise<{user: User, accessToken: string, refreshToken: string}>}
   * @throws {Error} Nếu thông tin đăng nhập không hợp lệ.
   */
  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Email hoặc mật khẩu không chính xác");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const error = new Error("Email hoặc mật khẩu không chính xác");
      error.statusCode = 401;
      throw error;
    }

    const payload = { userId: user._id, email: user.email };
    const { accessToken, refreshToken } = JWTService.generateTokens(payload);

    user.refreshToken = refreshToken;
    user.status_online = "online";
    await user.save();

    _io.sockets.emit("SERVER_LOGIN", user._id);

    return { user, accessToken, refreshToken };
  }

  /**
   * Đăng xuất người dùng.
   * @param {User} user - Đối tượng người dùng từ res.locals.
   */
  static async logout(user) {
    if (!user) {
      logger.warn("Logout attempt without a valid user.");
      return;
    }
    await User.updateOne(
      { _id: user._id },
      { status_online: "offline", refreshToken: null }
    );
    _io.sockets.emit("SERVER_LOGOUT", user._id);
    logger.info("User logged out successfully", { userId: user._id });
  }

  /**
   * Xử lý yêu cầu quên mật khẩu.
   * @param {string} email - Email của người dùng.
   * @returns {Promise<User>} Đối tượng người dùng.
   * @throws {Error} Nếu email không được đăng ký.
   */
  static async handleForgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Email không được đăng ký");
      error.statusCode = 404;
      throw error;
    }

    const forgotPasswordRecord = new ForgotPassword({ email });
    await forgotPasswordRecord.save();

    // Gửi email chứa mã OTP
    const subject = "Yêu cầu đặt lại mật khẩu";
    const html = `<p>Mã OTP để đặt lại mật khẩu của bạn là: <strong>${forgotPasswordRecord.otp}</strong>. Mã này sẽ hết hạn sau 3 phút.</p>`;
    sendMailHelper.sendMail(email, subject, html);

    return user;
  }

  /**
   * Xác thực mã OTP.
   * @param {string} email - Email của người dùng.
   * @param {string} otp - Mã OTP người dùng nhập.
   * @returns {Promise<void>}
   * @throws {Error} Nếu OTP không hợp lệ hoặc đã hết hạn.
   */
  static async verifyOtp(email, otp) {
    const record = await ForgotPassword.findOne({ email, otp });

    if (!record) {
      const error = new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
      error.statusCode = 400;
      throw error;
    }

    // (Tùy chọn) Có thể thêm kiểm tra thời gian hết hạn của OTP ở đây
  }

  /**
   * Đặt lại mật khẩu của người dùng.
   * @param {string} email - Email của người dùng.
   * @param {string} newPassword - Mật khẩu mới.
   * @returns {Promise<void>}
   */
  static async resetPassword(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.updateOne({ email }, { password: hashedPassword });
    // Xóa tất cả các bản ghi OTP cũ của email này để bảo mật
    await ForgotPassword.deleteMany({ email });
  }
}

module.exports = AuthService;
