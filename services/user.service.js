const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const saltRounds = 10;

class UserService {
  /**
   * Đăng ký một người dùng mới.
   * @param {object} userData - Dữ liệu người dùng từ request body.
   * @returns {Promise<User>} Đối tượng người dùng đã được tạo.
   * @throws {Error} Nếu email đã tồn tại.
   */
  static async register(userData) {
    const { email, password } = userData;

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      const error = new Error("Email đã tồn tại");
      error.statusCode = 409; // 409 Conflict
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }
}

module.exports = UserService;
