const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabse = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected Successfully.");
    })
    .catch((error) => console.log("Connection Failed", error));
};

module.exports = {initializeDatabse};
