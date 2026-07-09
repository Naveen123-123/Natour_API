const dotenv = require("dotenv");
// All the enviornment varaible can be accessible through the process.env
// Its a core module and it will be available accross the application
// Using this we can configer different operations accross multiple envronments (dev,prod,beta etc)
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

// uncaught exceptions - programming errors, etc
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

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

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

// console.log(x); - logging in the console

// TODO revisit this feature later
// handling uncaught exceptions - db connection errors, programming errors, etc
// process.on("unhandledRejection", (err) => {
//   console.error("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.error(err.name, err.message);

//   server.close(() => {
//     process.exit(1);
//   });
// });
