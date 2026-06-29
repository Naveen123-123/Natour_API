const express = require("express");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const app = express();
const morgan = require("morgan");

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
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

module.exports = app;
