const Tour = require("../models/tourModel");
const catchAsynch = require("../utils/catchAsynch");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

// Alias middle ware to get top 5 tours. It will set the query parameters to get the top 5 tours. It will be used in the route handler for the route /top-5-cheap. It will set the query parameters to get the top 5 tours based on ratingsAverage and price. It will also set the fields to be returned in the response. It will also call next() to pass the control to the next middleware function which is getAllTours.
exports.getTop5Tours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getTourStats = catchAsynch(async (req, res, next) => {
  // This is a aggregation pipeline. It is a way to process data in MongoDB. It is a way to perform complex queries on the data. It is a way to perform complex transformations on the data. It is a way to perform complex calculations on the data. It is a way to perform complex aggregations on the data. It is a way to perform complex groupings on the data. It is a way to perform complex sorting on the data. It is a way to perform complex filtering on the data. It is a way to perform complex projections on the data. It is a way to perform complex lookups on the data. It is a way to perform complex unwinds on the data. It is a way to perform complex facets on the data. It is a way to perform complex buckets on the data. It is a way to perform complex bucket auto on the data. It is a way to perform complex geo near on the data. It is a way to perform complex graph lookup on the data.
  // Each stage output is input for the next stage
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        averageRating: { $avg: "$ratingsAverage" },
        averagePrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
        totalTours: { $sum: 1 },
      },
    },
    {
      $sort: {
        averagePrice: 1, // sorts ascending order based on averagePrice. If we want to sort in descending order we can use -1 instead of 1.
      },
    },
    // stages can be repeated multiple times. We can add more stages to the pipeline to perform more complex operations on the data.
    // {
    //   $match: {
    //     totalTours: { $gte: 2 }, // filters the data based on the totalTours field. It will only return the documents where totalTours is greater than or equal to 2.
    //   },
    // },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlans = catchAsynch(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const monthlyPlans = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      monthlyPlans,
    },
  });
});

exports.getTour = getOne(Tour, { path: "reviews" });
exports.getAllTours = getAll(Tour);

// This is one way to create a new tour and save it to the file system. But we will use mongoose to save it to the database.
// const newTour = new Tour({})
// newTour.save()
// Direct create method on model object
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);
