const mongoose= require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    productCategoryId:{
        type: String,
        default: ""
    } ,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
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

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;