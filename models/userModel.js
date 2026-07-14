const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
  role: {
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.pre("save", function updatePasswordChangedAt() {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
  // next();
});

userSchema.methods.correctPassword = async function passwordCheck(candidatePassword, userPassword) {
  // It will internally convert the candidatePassword to hash and compare it with the userPassword which is already hashed. It will return true if they are same else false.
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function isPasswordChanagedAfter(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.passwordResetTokenMethod = function passwordReset() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
