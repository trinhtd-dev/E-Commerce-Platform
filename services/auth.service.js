const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const JWTService = require("./jwt.service");
const logger = require("../config/logger");

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
}

module.exports = AuthService;
