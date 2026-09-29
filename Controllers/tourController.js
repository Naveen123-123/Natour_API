const multer = require("multer");
const sharp = require("sharp");
const Tour = require("../models/tourModel");
const APPError = require("../utils/appError");
const catchAsynch = require("../utils/catchAsynch");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new APPError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsynch(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsynch(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  // Converting the earth's lats and langs
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new APPError("Please provide latitutr and longitude in the format lat,lng.", 400));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsynch(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new APPError("Please provide latitutr and longitude in the format lat,lng.", 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
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
