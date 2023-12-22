const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "User required"],
    ref: "User",
  },
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      productName: { type: String },
      productImg: { type: String },
    },
  ],

  total: {
    type: Number,
  },
  address: {
    type: Object,
  },
  status: { type: String, default: "pending" },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
