const mongoose = require("mongoose");
const generateString = require("../helpers/generateString");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    avatar: String,
    phone: String,
    address: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token:{
        type: String,
        default: generateString.token(20),
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;