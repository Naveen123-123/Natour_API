const Review = require("../models/reviewsModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsynch = require("../utils/catchAsynch");
const APPError = require("../utils/appError");

exports.getAllReviews = catchAsynch(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;

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
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newReview,
    },
  });
});
