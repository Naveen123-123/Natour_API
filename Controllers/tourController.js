const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next) => {
  const tour = tours.find((el) => el.id === req.params.id * 1);
  if (req.params.id * 1 > tours.length || !tour) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID',
    });
  }
  next();
};

// Middleware for create call
exports.checkBodyParams = (req, res, next) => {
  const { price, name } = req.body;
  if (!price || !name) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Name and Price fields are required',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    timestamp: req.timeStamp,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === id);
  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  };
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (error) => {
    if (error) {
      res.status(201).json({
        status: 'Failed to update the file',
        data: {
          tour: tours[tourIndex],
        },
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          tour: tours[tourIndex],
        },
      });
    }
  });
};
exports.deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((el) => el.id === id);
  const updatedTours = tours.filter((t) => t.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (error) => {
      if (error) {
        res.status(201).json({
          status: 'Failed to update the file',
          data: {
            tour: tours[tourIndex],
          },
        });
      } else {
        res.status(204).json({
          status: 'success',
          data: null,
        });
      }
    }
  );
};
