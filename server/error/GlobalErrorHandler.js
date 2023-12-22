const AppError = require("./AppError");
const fs = require("fs");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value : ${value}.Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data.${errors.join(".")}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError("Invalid Token.Please Log in again", 401);

const handleJWTExpiredError = (err) =>
  new AppError("Your token expired.Login again", 401);

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      err: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.filename, (err) => {
      console.log(err);
    });
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, name: err.name, message: err.message };

  if (error.name === "CastError") error = handleCastErrorDB(error);

  if (error.code === 11000) error = handleDuplicateFieldsDB(error);

  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  if (error.name === "JsonWebTokenError") error = handleJWTError(error);

  if (error.name === "TokenExpiredError") error = handleJWTExpiredError(error);

  sendErrorProd(error, res);
};
