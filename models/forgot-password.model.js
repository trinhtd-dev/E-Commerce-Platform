const mongoose = require("mongoose");
const generateString = require("../helpers/generateString");

const forgotPasswordModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    otp: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 6,
        default: generateString.generateRandomNumber(6)
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: '300' // Document will be automatically deleted after 1 hour
    }
}, {
    timestamps: true
});

const ForgotPassword = mongoose.model("forgotpassword", forgotPasswordModel, "forgot-password");
module.exports = ForgotPassword;