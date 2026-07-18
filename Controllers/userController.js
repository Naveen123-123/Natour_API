const catchAsynch = require("../utils/catchAsynch");
const User = require("../models/userModel");
const { deleteOne, updateOne, getAll, getOne } = require("./handlerFactory");

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "Please sign up!",
  });
};

exports.deleteCurrentUser = catchAsynch(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.getMe = (req, _, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteUser = deleteOne(User);
exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
