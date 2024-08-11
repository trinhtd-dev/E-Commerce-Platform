const mongoose= require("mongoose");
const generateString = require("../helpers/generateString");


const accountSchema = new mongoose.Schema({
    fullName: String,
    avatar: String,
    email: String,
    password: String,
    phone: String,
    role: String,
    status: String,
    token:{
        type: String,
        default: generateString.token(20),
    },
    deleted:{
        type: Boolean,
        default: false,
    },
    createdBy: {
        accountId: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
    },
    deletedBy: {
        accountId: String,
        deletedAt: Date,
    },
    updatedBy:[
        {
            accountId: String,
            updatedAt: Date,
        }
    ],
}, 
{
    timestamps: true
});

const account = mongoose.model("Account", accountSchema, "accounts");
module.exports = account;