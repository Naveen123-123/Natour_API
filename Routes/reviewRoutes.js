const express = require("express");
const { getAllReviews, createReview, getReview } = require("../Controllers/reviewController");
const { protect, restrictTo } = require("../Controllers/authController");

const router = express.Router();

router.route("/").get(protect, restrictTo("user"), getAllReviews).post(createReview);
router.route("/:id").get(getReview);

module.exports = router;
