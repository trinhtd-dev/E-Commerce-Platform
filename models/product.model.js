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
    brand: String,
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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
          auto: true,
        },
        name: String,
        sku: String,
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discountPercentage: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        thumbnail: String,
        attributes: [
          {
            type: {
              type: String,
              required: true,
            },
            value: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    images: [
      {
        url: String,
        alt: String,
        position: Number,
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

    // Thêm defaultVariantId để chỉ định biến thể mặc định
    defaultVariantId: {
      type: String,
      default: null,
    },

    // Thông tin tổng hợp - được tính toán từ variants
    priceRange: {
      min: Number,
      max: Number,
    },
    totalStock: {
      type: Number,
      default: 0,
    },

    // Thêm trường mới để định nghĩa các attribute có thể có
    attributeTypes: [
      {
        name: String, // Ví dụ: "Color", "Size", "Material"
        values: [
          {
            value: String, // Ví dụ: "Red", "XL", "Cotton"
            thumbnail: String, // Ảnh đại diện cho giá trị (tùy chọn, ví dụ: mẫu màu)
          },
        ],
        required: Boolean, // Có bắt buộc chọn hay không
      },
    ],
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

// Method để tính lại thông tin tổng hợp
productSchema.methods.recalculateMetadata = function () {
  // Cập nhật priceRange
  const prices = this.variants.map((v) => v.price);
  if (prices.length > 0) {
    this.priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  // Cập nhật totalStock
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);

  // Cập nhật defaultVariantId nếu chưa có
  if (!this.defaultVariantId && this.variants.length > 0) {
    this.defaultVariantId = this.variants[0]._id;
  }
};

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
