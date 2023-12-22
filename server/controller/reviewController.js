const Review = require("../model/Review");
const AppError = require("../error/AppError");

exports.getAllReview = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.pid });

    if (!reviews) {
      return next(new AppError("Reviews not found", 404));
    }

    const onereview = reviews.filter(
      (r) => r.user._id.valueOf() === req.user._id.valueOf()
    );

    res.status(200).json({
      status: "success",
      reviews,
      onereview,
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    req.body.product = req.params.pid;

    const review = await Review.find({
      user: req.body.user,
      product: req.body.product,
    });

    if (review && review.length > 0) {
      return next(new AppError("You only one review each one product", 400));
    }

    const newReview = await Review.create({
      user: req.body.user,
      product: req.body.product,
      rating: req.body.rating,
      review: req.body.review,
    });

    if (!newReview) {
      return next(new AppError("New Review can't create", 400));
    }

    res.status(201).json({
      status: "success",
      newReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.pid);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.pid, req.body, {
      new: true,
    });

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.rid);

    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    res.status(200).json({
      status: "success",
      review,
    });
  } catch (error) {
    next(error);
  }
};

exports.reviewAverage = async (req, res, next) => {
  try {
    const reviewAvg = await Review.aggregate([
      {
        $group: {
          _id: "$product",
          averageReview: { $avg: "$rating" },
        },
      },
    ]);

    res.status(200).json(reviewAvg);
  } catch (err) {
    next(err);
  }
};
