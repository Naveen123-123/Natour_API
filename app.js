const express = require("express");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");
const APPError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const reviewRouter = require("./Routes/reviewRoutes");

const app = express();
// Middlewares

// Secure http headers
app.use(helmet());

// Body parser to json, and limit body to 10kb
app.use(express.json({ limit: "10kb" }));
// This is how can we use env variables to configure things for different env's
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Data sanitization aginest NoSql query injection
// ex :    "email" : {"$ge":""} allows access to login with correct password
app.use(sanitize());

// Data sanitization aginest xss
//   "name" : "<div id='naveen'>naveen</div>", --->>> "&lt;div id='naveen'>naveen&lt;/div>",
app.use(xss());

// hpp - http parameter polution
// {{URL}}api/v1/tours?sort=-price&sort=ratingsAverage ---> sorting on two doesn't work, throws error but this package handles it by taking last option for sorting.
app.use(
  hpp({
    whitelist: [
      "duration",
      "difficulty",
      "maxGroupSize",
      "ratingsQuantity",
      "ratingsAverage",
      "price",
      "rating",
    ],
  })
);

// Testing middle ware
app.use((req, res, next) => {
  req.timeStamp = new Date().toISOString();
  next();
});

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP please try again later",
});

// limiting the no of requests for implementing security for brutforce attacks
app.use("/api", limiter);
// To access the static files from the repo
// Inbuilt middleware for accessing static files in the repo
app.use(express.static(`${__dirname}/public`));

// Mounting the Routes
// Using routes as a middlewares
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handling default routes
// If the above routes are not matched then this route will be executed
// Order is important here. This route should be defined after all the other routes.
app.all("*", (req, res, next) => {
  next(new APPError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
