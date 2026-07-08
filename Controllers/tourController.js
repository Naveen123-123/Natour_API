const Tour = require("../models/tourModel");

// Alias middle ware to get top 5 tours. It will set the query parameters to get the top 5 tours. It will be used in the route handler for the route /top-5-cheap. It will set the query parameters to get the top 5 tours based on ratingsAverage and price. It will also set the fields to be returned in the response. It will also call next() to pass the control to the next middleware function which is getAllTours.
exports.getTop5Tours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // Preparing the query
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    // We can use the replace method to replace the gte,gt,lte,lt with $gte,$gt,$lte,$lt so that we can use it in the query. We can use regex to find the gte,gt,lte,lt in the query string and replace it with $gte,$gt,$lte,$lt. We can use the \b to find the word boundary so that we can find the exact match of gte,gt,lte,lt and not the substring of any other word.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryObjParsed = JSON.parse(queryStr);

    // Fetching the data from the database and getting query instance so that we can apply mongoose methods on it. We can apply multiple methods on the query instance and then finally execute it to get the data.
    const query = Tour.find(queryObjParsed);

    // 2) Sorting
    if (req.query.sort) {
      // We can use the split method to split the sort query string by comma and then join it with space so that we can use it in the query. We can use the join method to join the array of strings with space so that we can use it in the query.
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields); // fetches the specified fields from the database. We can use the select method to select the fields we want to include or exclude in the query. We can use the - sign to exclude the field and + sign to include the field.
    } else {
      query.select("-__v"); // To exclude the default field __v which is added by mongoose to keep track of the version of the document. We can use the select method to select the fields we want to include or exclude in the query. We can use the - sign to exclude the field and + sign to include the field.
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    // Tour.find().where("duration").equals(5).where("difficulty").equals("easy");

    // Executing the query
    const tours = await query;

    // Sending the response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Invalid data",
      error: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    // findById is same as Tour.find({_id:req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Invalid data",
      error: err,
    });
  }
};
exports.createTour = async (req, res) => {
  // This is one way to create a new tour and save it to the file system. But we will use mongoose to save it to the database.
  // const newTour = new Tour({})
  // newTour.save()
  try {
    // Direct create method on model object
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Invalid data",
      error: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("tour", tour);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to update the data",
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to update the data",
    });
  }
};
