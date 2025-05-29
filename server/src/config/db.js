const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("//localhost:3000/cinehub");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
