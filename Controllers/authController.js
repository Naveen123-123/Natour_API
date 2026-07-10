const User = require("../models/userModel");
const catchAsynch = require("../utils/catchAsynch");

exports.signUp = catchAsynch(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
