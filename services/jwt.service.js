const jwt = require("jsonwebtoken");
const config = require("../config/jwt");

class JWTService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token, secret = config.JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_SECRET
      );
      if (!decoded) return null;

      // Tạo access token mới
      const payload = { userId: decoded.userId, email: decoded.email };
      return this.generateTokens(payload);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JWTService;
