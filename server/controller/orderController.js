const Order = require("../model/Order");
const AppError = require("../error/AppError");

exports.getAllOrder = async (req, res, next) => {
  try {
    const orders = await Order.find();

    if (!orders) {
      return next(new AppError("Orders not found", 404));
    }

    res.status(200).json({
      status: "success",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    req.body.user = req.user._id;

    const newOrder = await Order.create(req.body);

    if (!newOrder) {
      return next(new AppError("New Order can't create", 400));
    }

    res.status(201).json({
      status: "success",
      newOrder,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.pid);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.pid, req.body, {
      new: true,
    });

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.pid);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      status: "success",
      order,
    });
  } catch (error) {
    next(error);
  }
};
