module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h", // Token hết hạn sau 24h
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" // Refresh token hết hạn sau 7 ngày
}; 