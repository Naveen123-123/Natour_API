const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Field is required"],
    },
    rating: {
      type: Number,
      default: 3,
      min: [1, "Minimum rating would be 1"],
      max: [5, "Maximum rating would be 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A review must have a user"],
      },
    ],
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "A review must have a tour"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
