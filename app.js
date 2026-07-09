const express = require("express");
const morgan = require("morgan");
const APPError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");

const app = express();

// Middlewares
app.use(express.json());
// This is how can we use env variables to configure things for different env's
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.timeStamp = new Date().toISOString();
  next();
});
// To access the static files from the repo
// Inbuilt middleware for accessing static files in the repo
app.use(express.static(`${__dirname}/public`));

// Mounting the Routes
// Using routes as a middlewares
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handling default routes
// If the above routes are not matched then this route will be executed
// Order is important here. This route should be defined after all the other routes.
app.all("*", (req, res, next) => {
  next(new APPError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
