const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsynch = require("../utils/catchAsynch");
const APPError = require("../utils/appError");

// Alias middle ware to get top 5 tours. It will set the query parameters to get the top 5 tours. It will be used in the route handler for the route /top-5-cheap. It will set the query parameters to get the top 5 tours based on ratingsAverage and price. It will also set the fields to be returned in the response. It will also call next() to pass the control to the next middleware function which is getAllTours.
exports.getTop5Tours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsynch(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
  const tours = await features.query;

  // Sending the response
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});
exports.getTour = catchAsynch(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  // findById is same as Tour.find({_id:req.params.id})
  if (!tour) {
    return next(new APPError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});
exports.createTour = catchAsynch(async (req, res, next) => {
  // This is one way to create a new tour and save it to the file system. But we will use mongoose to save it to the database.
  // const newTour = new Tour({})
  // newTour.save()
  // Direct create method on model object
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});
exports.updateTour = catchAsynch(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new APPError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});
exports.deleteTour = catchAsynch(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new APPError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
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
