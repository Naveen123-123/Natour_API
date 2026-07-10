const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minLength: 8,
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  photo: String,
});

// Encrypting the password before saving it to the database. We are using bcrypt library to encrypt the password. We are using pre middleware to encrypt the password before saving it to the database. We are using async function because bcrypt.hash() is an async function. We are using this.isModified() method to check if the password is modified or not. If the password is not modified, we will not encrypt it again. We are using this.passwordConfirm = undefined; to delete the passwordConfirm field from the database because we don't need to store it in the database. It is only used for validation purpose.
userSchema.pre("save", async function encripting() {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return;
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field as which is not required to be stored in the database. It is only used for validation purpose.
  this.passwordConfirm = undefined;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
