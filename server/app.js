const path = require("path");
const express = require("express");
const app = express();
const userRouter = require("./router/authRouter");
const productRouter = require("./router/productRouter");
const cartRouter = require("./router/cartRouter");
const orderRouter = require("./router/orderRouter");
const reviewRouter = require("./router/reviewRouter");
const stripeRouter = require("./router/stripeRouter");
const globalErrorHandler = require("./error/GlobalErrorHandler");
const AppError = require("./error/AppError");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://m-shopping:TUEB3M5GmY5k1dov@cluster0.mrwvd.mongodb.net/m-shopping?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connect successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join("./views"));
app.set("view engine", "pug");

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "https://mern-shopping-ui.vercel.app",
    credentials: true,
  })
);

app.use(
  "/public/img/users",
  express.static(path.join("public", "img", "users"))
);

app.use(
  "/public/img/products",
  express.static(path.join("public", "img", "products"))
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/checkout", stripeRouter);

app.use("*", (req, res, next) => {
  return next(
    new AppError(`The path you find ${req.originalUrl} not found`, 404)
  );
});

app.use(globalErrorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running!");
});
