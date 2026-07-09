const mongoose = require("mongoose");
// const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
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
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    // slug: String,
    images: [String],
    startDates: [Date],
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
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// // Middleware to generate slug before saving the document
// // Trigger this on save and create operations. It will not trigger on update operations / insertMany operations.
// TODO : This needs a re-visit
// tourSchema.pre("save", function () {
//   this.slug = slugify(this.name, { lower: true });
//   // next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
