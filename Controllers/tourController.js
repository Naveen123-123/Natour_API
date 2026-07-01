const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch {
    res.status(400).json({
      status: "Failed",
      message: "Invalid data",
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
  } catch {
    res.status(400).json({
      status: "Failed",
      message: "Invalid data",
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
