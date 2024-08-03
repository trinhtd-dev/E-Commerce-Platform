const mongoose= require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String,
    parent: String,
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
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
    slug:{
        type: String,
        slug: "title",
        unique: true,
    }
}, 
{
    timestamps: true
});

const productCategory = mongoose.model("Product Category", productCategorySchema, "products-category");

module.exports = productCategory;