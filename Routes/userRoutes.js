const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");
const { signUp, login, forgotPassword, resetPassword } = require("../Controllers/authController");

const router = express.Router();
router.post("/signup", signUp);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.post("/login", login);
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
