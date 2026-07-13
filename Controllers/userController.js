const catchAsynch = require("../utils/catchAsynch");
const User = require("../models/userModel");

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not defined yet!",
  });
};

exports.getAllUsers = catchAsynch(async (req, res, next) => {
  // EXECUTE QUERY
  const users = await User.find();

  // Sending the response
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not defined yet!",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not defined yet!",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not defined yet!",
  });
};
