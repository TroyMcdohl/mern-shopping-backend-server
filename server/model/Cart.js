const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User required"],
  },
  productId: {
    type: String,
  },
  productName: {
    type: String,
    required: [true, "Product Name required"],
  },
  productPrice: {
    type: Number,
    required: [true, "Product Price required"],
  },
  productImg: {
    type: String,
    required: [true, "Product Img required"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
