const APPError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new APPError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new APPError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new APPError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("Error 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const handleJWTError = () => new APPError("Invalid Token please login again", 401);
const handleJWTExpiredError = () =>
  new APPError("Your token has expired! Please log in again.", 401);

module.exports = (err, req, res, next) => {
  let error = {
    ...err,
    statusCode: err.statusCode || 500,
    status: err.status || "error",
    message: err.message,
    stack: err.stack,
    name: err.name,
  };
  if (process.env.NODE_ENV === "development") {
    // handling cast errors, its a kind of handling default errors in mongoose. When we pass an invalid id to the findById method, it will throw a cast error. We can handle this error and send a proper message to the client.
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorDev(error, res);
  }

  if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  }
  next();
};
