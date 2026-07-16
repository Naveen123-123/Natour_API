const mongoose = require("mongoose");
// const User = require("./userModel");
// const validator = require("validator");
// const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxLength: [40, "A tour name must have less or equal than 40 characters"],
      minLength: [10, "A tour name must have more or equal than 10 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator(val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
    },
    startLocation: {
      // Geo Json
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number], // longitude and lattitude
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number], // longitude and lattitude
        address: String,
        description: String,
        day: Number,
      },
    ],
    description: {
      type: String,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have an image cover"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    // slug: String,
    images: [String],
    startDates: [Date],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Virtual properties are not stored in the database.
// They are only available when we get the data from the database.
//  We can use virtual properties to create new properties that are derived from existing properties.
// For example, we can create a virtual property called durationWeeks that is derived from the duration property.
//  We can use this virtual property to get the duration in weeks instead of days.
tourSchema.virtual("durationWeeks").get(function getDuration() {
  return this.duration / 7;
});

// To get the guide users into tours documents
tourSchema.pre(/^find/, async function addGuides() {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
});

// // Middleware to generate slug before saving the document
// // Trigger this on save and create operations. It will not trigger on update operations / insertMany operations.
// TODO : This needs a re-visit
// tourSchema.pre("save", function () {
//   this.slug = slugify(this.name, { lower: true });
//   // next();
// });

// List guides in the tours schema
// This will be triggered when create and save operations
// Embedding the docs nestedly
// tourSchema.pre("save", async function addGuides() {
//   this.guides = await Promise.all(this.guides.map((id) => User.findById(id)));
// });
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
