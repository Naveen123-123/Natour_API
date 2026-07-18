const Review = require("../models/reviewsModel");
const catchAsynch = require("../utils/catchAsynch");
const APPError = require("../utils/appError");

exports.getAllReviews = catchAsynch(async (req, res, next) => {
  // prepare filters
  let filters = {};

  if (req.params.tourId) filters = { tour: req.params.tourId };

  const reviews = await Review.find(filters);

  // Sending the response
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.getReview = catchAsynch(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  // findById is same as Tour.find({_id:req.params.id})
  if (!review) {
    return next(new APPError("No review found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});
exports.createReview = catchAsynch(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newReview,
    },
  });
});
