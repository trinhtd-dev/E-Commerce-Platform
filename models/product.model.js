const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    productCategoryId: {
      type: String,
      default: "",
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: Number,
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    thumbnail: String,
    status: String,
    position: Number,
    featured: String,
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      details: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          score: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
          comment: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    sold: Number,
    variants: [
      {
        name: String,
        price: Number,
        stock: Number,
        thumbnail: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      accountId: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deletedBy: {
      accountId: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        accountId: String,
        updatedAt: Date,
      },
    ],

    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Thêm method để tính lại rating trung bình
productSchema.methods.calculateAverageRating = function () {
  if (this.rating.details.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.rating.details.reduce((acc, item) => acc + item.score, 0);
    this.rating.average = (sum / this.rating.details.length).toFixed(1);
    this.rating.count = this.rating.details.length;
  }
};

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
