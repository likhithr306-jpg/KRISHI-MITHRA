const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const users = await User.find({}, { name: 1, phone: 1, email: 1 });
    console.log("Current Users in Database:");
    console.log(JSON.stringify(users, null, 2));

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
