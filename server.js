const dotenv = require("dotenv");
// All the enviornment varaible can be accessible through the process.env
// Its a core module and it will be available accross the application
// Using this we can configer different operations accross multiple envronments (dev,prod,beta etc)
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 3001;
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  encodeURIComponent(process.env.DATABASE_PASSWORD)
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "The forest Hiker1",
  price:500
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error("Error saving tour:", err);
  });

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
