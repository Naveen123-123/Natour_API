const express = require("express");
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteMe,
  deleteUser,
  getMe,
} = require("../Controllers/userController");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  protect,
} = require("../Controllers/authController");

const router = express.Router();
router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.use(protect); // It will protect the routes after this statements as middleweres acts in sequence

router.patch("/updatePassword/:id", updatePassword);
router.delete("/deleteUser", deleteMe);
router.route("/me").get(getMe, getUser);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
