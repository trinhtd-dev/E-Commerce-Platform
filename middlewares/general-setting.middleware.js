const GeneralSetting = require("../models/general-setting.model");

module.exports.generalSetting = async (req, res, next) =>{
   const generalSetting = await GeneralSetting.findOne({});
   res.locals.generalSetting = generalSetting;
   next();
}