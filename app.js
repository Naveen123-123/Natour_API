const express = require("express");
const morgan = require("morgan");
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

module.exports = app;
