const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsynch = require("../utils/catchAsynch");
const APPError = require("../utils/appError");

const getToken = (id) =>
  jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsynch(async (req, res, next) => {
  // This way ensure's that role cannot be set by the user during signup, preventing unauthorized role assignment.
  // We will only store the necessary fields for user creation, and any additional fields like role will be set by the server or through an admin interface.
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // eslint-disable-next-line no-underscore-dangle
  const id = newUser._id;
  const token = getToken(id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsynch(async (req, res, next) => {
  // This way ensure's that role cannot be set by the user during signup, preventing unauthorized role assignment.
  // We will only store the necessary fields for user creation, and any additional fields like role will be set by the server or through an admin interface.
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new APPError("Please provide email and password!", 400));
  }

  // Check if user exists and password is correct
  // We are using select("+password") to include the password field in the query result, as it is set to select: false in the user schema. This allows us to access the password for comparison during login.
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new APPError("Incorrect email or password", 401));
  }

  // eslint-disable-next-line no-underscore-dangle
  const id = user._id;
  const token = getToken(id);
  res.status(200).json({
    status: "success",
    token,
  });
});
