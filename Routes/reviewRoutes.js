const express = require("express");
const { getAllReviews, createReview, getReview } = require("../Controllers/reviewController");
const { protect, restrictTo } = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });

// Due to the mergeParams now it will trigger this for both the routes.
// Post /tour/23434/reviews
// Get /tour/23434/reviews
// Get /reviews
router
  .route("/")
  .get(protect, restrictTo("user", "guide"), getAllReviews)
  .post(protect, restrictTo("user", "guide"), createReview);
router.route("/:id").get(getReview);

module.exports = router;
