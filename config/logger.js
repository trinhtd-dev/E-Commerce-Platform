const winston = require("winston");
const path = require("path");

// Format logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  })
);

// Tạo logger instance với các transport khác nhau tùy môi trường
const logger = winston.createLogger({
  format: logFormat,
  transports: [],
});

// Trong môi trường development hoặc Vercel (production), sử dụng console
if (process.env.NODE_ENV !== "production" || process.env.VERCEL) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
} else {
  // Chỉ trong môi trường production không phải Vercel, ghi ra file
  logger.add(
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
      level: "info",
    })
  );
}

module.exports = logger;
