const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cartId: String,
    userInfo: {
      fullName: String,
      phone: String,
      email: String,
      address: {
        province: {
          code: String,
          name: String,
        },
        district: {
          code: String,
          name: String,
        },
        ward: {
          code: String,
          name: String,
        },
        street: String,
        houseNumber: String,
        note: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
    },
    products: [
      {
        productId: String,
        variantId: String,
        price: Number, // price at the time of order
        discountPercentage: Number, // discount percentage at the time of order
        quantity: Number,
      },
    ],
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    estimatedDelivery: Date,
    deliveryStatus: {
      type: String,
      enum: ["pending", "processing", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: String,
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderSchema, "orders");
module.exports = order;
