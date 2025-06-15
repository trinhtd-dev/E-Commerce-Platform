const GeneralSetting = require("../../models/general-setting.model");

module.exports.generalSetting = async (req, res, next) => {
  try {
    const generalSetting = await GeneralSetting.findOne({});
    if (generalSetting) {
      res.locals.generalSetting = generalSetting;
    }
  } catch (error) {
    console.error("Error fetching general settings for admin:", error);
  }
  next();
};
