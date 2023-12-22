const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const productController = require("../controller/productController");
const reviewRouter = require("./reviewRouter");
const cartRouter = require("./cartRouter");

router.use("/:pid/review", reviewRouter);
router.use("/:pid/cart", cartRouter);

router
  .route("/")
  .get(productController.getAllProduct)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductImages,
    productController.resizeUploadProductImages,
    productController.createProduct
  );

router
  .route("/:pid")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductImages,
    productController.resizeUploadProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
