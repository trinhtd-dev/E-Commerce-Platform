const mongoose = require("mongoose");
const generateString = require("../helpers/generateString");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
    },
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
    status: {
        type: String,
        default: "active",
    },
    status_online:{
        type: String,
        default: "offline"
    },

    friendList: [
        {
            userId: String,
            roomChatId: String,
        }
    ],

    friendRequest: [{
        userId: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    sentInvitation: [{
        userId: String,
    }],

    token:{
        type: String,
        default: generateString.token(20),
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;