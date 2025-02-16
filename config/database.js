const mongoose = require("mongoose");
const logger = require("./logger");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection error:", { error: error.message });
  }
};
