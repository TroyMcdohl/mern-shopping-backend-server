const Cart = require("../model/Cart");
const AppError = require("../error/AppError");

exports.getAllCart = async (req, res, next) => {
  try {
    const carts = await Cart.find({ user: req.user._id });

    if (!carts) {
      return next(new AppError("Carts not found", 404));
    }

    res.status(200).json({
      status: "success",
      carts,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCart = async (req, res, next) => {
  try {
    req.body.user = req.user._id;

    const cart = await Cart.find({
      user: req.body.user,
      productId: req.body.productId,
    });

    if (cart && cart.length > 0) {
      return next(new AppError("You already add this to cart", 400));
    }

    const newCart = await Cart.create({
      user: req.body.user,
      productId: req.body.productId,
      productName: req.body.productName,
      productImg: req.body.productImg,
      productPrice: req.body.productPrice,
      quantity: req.body.quantity,
      total: req.body.total,
    });

    if (!newCart) {
      return next(new AppError("New Cart can't create", 400));
    }

    res.status(201).json({
      status: "success",
      newCart,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.pid);

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, req.body, {
      new: true,
    });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.cid);

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
