const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controller/authController");
const cartController = require("../controller/cartController");

router.use(authController.protect);

router
  .route("/")
  .get(cartController.getAllCart)
  .post(cartController.createCart);

router
  .route("/:cid")
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

module.exports = router;
