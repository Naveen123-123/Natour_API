const dotenv = require("dotenv");
const fs = require("fs");
// All the enviornment varaible can be accessible through the process.env
// Its a core module and it will be available accross the application
// Using this we can configer different operations accross multiple envronments (dev,prod,beta etc)
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");

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

const importData = async () => {
  try {
    const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));
    await Tour.create(tours);
    console.log("Data successfully loaded");
  } catch (err) {
    console.error("Error loading data:", err);
  }
  // eslint-disable-next-line no-process-exit
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.error("Error deleting data:", err);
  }
  // eslint-disable-next-line no-process-exit
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Invalid command. Use --import to import data or --delete to delete data.");
  // eslint-disable-next-line no-process-exit
  process.exit();
}
