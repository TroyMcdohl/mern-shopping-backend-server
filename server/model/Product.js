const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name required"],
  },
  price: {
    type: Number,
    required: [true, "Price required"],
  },
  des: {
    type: String,
    required: [true, "Description required"],
  },
  color: {
    type: String,
    required: [true, "Color required"],
  },
  size: {
    type: String,
    required: [true, "Size required"],
  },
  kind: {
    type: String,
    required: [true, "Types of c required"],
  },
  images: [
    {
      type: String,
      required: [true, "Images required"],
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
