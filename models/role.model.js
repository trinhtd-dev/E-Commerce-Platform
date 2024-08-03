const mongoose= require("mongoose");

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions:{
        type: Array,
        default: [],
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

const role = mongoose.model("Role", roleSchema, "roles");
module.exports = role;