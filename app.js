const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    },
  );
};
const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === id);
  if (tourIndex === -1) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }
  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  };
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) {
        res.status(201).json({
          status: "Failed to update the file",
          data: {
            tour: tours[tourIndex],
          },
        });
      } else {
        res.status(200).json({
          status: "success",
          data: {
            tour: tours[tourIndex],
          },
        });
      }
    },
  );
};
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((el) => el.id === id);
  if (tourIndex === -1) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }
  const updatedTours = tours.filter((t) => t.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (error) => {
      if (error) {
        res.status(201).json({
          status: "Failed to update the file",
          data: {
            tour: tours[tourIndex],
          },
        });
      } else {
        res.status(204).json({
          status: "success",
          data: null,
        });
      }
    },
  );
};
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
