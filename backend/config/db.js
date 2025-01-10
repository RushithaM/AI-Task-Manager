const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection
    .once("open", function () {
      console.log("Conection has been made!");
    })
    .on("error", function (error) {
      console.log("Error is: ", error);
    });
};

module.exports = connectDB;
