const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generalSettingSchema = new Schema({
   logo: String,
   email: String,
   phone: String,
   address: String,
   facebook: String,
   twitter: String,
   instagram: String,
   linkedin: String,
   googleAnalytics: String,
   footerText: String,
});



const GeneralSetting = mongoose.model('GeneralSetting', generalSettingSchema, "general-setting");

module.exports = GeneralSetting;