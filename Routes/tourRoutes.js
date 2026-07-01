const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require("../Controllers/tourController");

const router = express.Router();

// It will get trigger when there is id param in the url
// We can put some common logic here for different routes.
// It will be like a pipeline we can pass through this phase -> validations,transformations etc
// router.param("id", checkID);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
