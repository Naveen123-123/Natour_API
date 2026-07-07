const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },
  summary: {
    type: String,
    required: [true, "A tour must have a summary"],
  },
  description: {
    type: String,
    required: [true, "A tour must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have an image cover"],
  },
  images: [String],
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
