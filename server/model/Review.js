const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating required"],
    },
    review: {
      type: String,
      required: [true, "Review required"],
    },
  },
  {
    toObject: { virtual: true },
    toJSON: { virtual: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
