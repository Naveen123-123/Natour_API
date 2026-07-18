const express = require("express");
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setTourAndUserId,
} = require("../Controllers/reviewController");
const { protect, restrictTo } = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });
router.use(protect); // Protect all the routes

// Due to the mergeParams now it will trigger this for both the routes.
// Post /tour/23434/reviews
// Get /tour/23434/reviews
// Get /reviews
router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user", "admin"), setTourAndUserId, createReview);
router
  .route("/:id")
  .get(getReview)
  .delete(restrictTo("user", "admin"), deleteReview)
  .patch(restrictTo("user", "admin"), updateReview);

module.exports = router;
