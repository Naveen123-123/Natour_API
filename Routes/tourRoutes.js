const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTop5Tours,
  getTourStats,
  getMonthlyPlans,
} = require("../Controllers/tourController");
const { protect, restrictTo } = require("../Controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// It will be used as a nested route
// Post /tours/23434/reviews
// Get /tours/12332/reviews
router.use("/:tourId/reviews", reviewRouter);

// It will get trigger when there is id param in the url
// We can put some common logic here for different routes.
// It will be like a pipeline we can pass through this phase -> validations,transformations etc
// router.param("id", checkID);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plans/:year").get(getMonthlyPlans);
router.route("/top-5-cheap").get(getTop5Tours, getAllTours);
router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
