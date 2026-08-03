const mongoose = require("mongoose");
const Tour = require("./tourModel");

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

reviewsSchema.statics.calcAverageRatings = async function statsFn(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, // default average rating
    });
  }
};

// Restricting single user to add multiple reivews on a tour
reviewsSchema.index({tour:1,user:1},{unique:true})

reviewsSchema.post("save", function updateRatings() {
  // To point current model
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewsSchema.pre(/^findOneAnd/, async function getTourId() {
  this.r = await this.model.findOne(this.getFilter());
});

reviewsSchema.post(/^findOneAnd/, async function updateTheData() {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

// To get the user and tour data embeded into reviews
reviewsSchema.pre(/^find/, async function addGuides() {
  this.populate({
    path: "user",
    select: "name",
  });
});

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
