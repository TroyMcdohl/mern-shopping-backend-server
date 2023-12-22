const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(reviewController.createReview);

router.route("/productavg").get(reviewController.reviewAverage);

router
  .route("/:rid")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
