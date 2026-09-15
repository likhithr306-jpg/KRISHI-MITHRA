const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ ERROR: MONGO_URI is missing in .env file!");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err.message);
    // Don't exit immediately, let the server try to stay alive if possible
  }
};

module.exports = connectDB;