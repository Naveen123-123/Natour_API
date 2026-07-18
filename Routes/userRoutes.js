const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteCurrentUser,
  deleteUser,
  getMe,
} = require("../Controllers/userController");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../Controllers/authController");

const router = express.Router();
router.post("/signup", signUp);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/updatePassword/:id", protect, updatePassword);
router.delete("/deleteUser", protect, deleteCurrentUser);
router.post("/login", login);
router.route("/").get(getAllUsers).post(createUser);
router.route("/me").get(protect, getMe, getUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
