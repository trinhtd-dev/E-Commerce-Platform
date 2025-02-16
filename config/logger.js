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

// Tạo logger instance
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // Log errors
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    // Log info
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
      level: "info",
    }),
  ],
});

// Log to console in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
