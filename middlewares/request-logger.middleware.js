const logger = require("../config/logger");

module.exports.logRequest = (req, res, next) => {
  // Log khi request bắt đầu
  const start = Date.now();

  // Log khi request kết thúc
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userIP: req.ip,
    });
  });

  next();
};
