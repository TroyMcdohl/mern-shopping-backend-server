const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const orderController = require("../controller/orderController");

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getAllOrder)
  .post(orderController.createOrder);

router
  .route("/:oid")
  .get(authController.restrictTo("admin"), orderController.getOrder)
  .patch(authController.restrictTo("admin"), orderController.updateOrder)
  .delete(authController.restrictTo("admin"), orderController.deleteOrder);

module.exports = router;
