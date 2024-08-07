const mongoose= require("mongoose");

const orderSchema = new mongoose.Schema({
  cartId: String,
  userInfo: {
    fullName: String,
    phone: String,
    email: String,
    address: String, // shipping address
  },
    products: [{
        productId: String,
        price: Number, // price at the time of order
        discountPercentage: Number, // discount percentage at the time of order
        quantity: Number
    }],
}, 
{
    timestamps: true
});

const order = mongoose.model("order", orderSchema, "orders");
module.exports = order;