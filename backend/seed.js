const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

const dummyUsers = [
  {
    name: "Ramesh Kumar",
    phone: "9988776655",
    email: "ramesh@farmer.com",
    password: "password123",
    district: "Mysuru",
    taluk: "Nanjangud",
    village: "Hullahalli",
    landSize: "5",
    soilType: "Red Soil",
    activeCrop: "Ragi",
    currentStage: "Cultivation",
    completedTasks: { Setup: ["Land Available", "Water Source", "Seeds Purchase"] }
  },
  {
    name: "Suresh Gowda",
    phone: "8877665544",
    email: "suresh@farmer.com",
    password: "password123",
    district: "Mandya",
    taluk: "Maddur",
    village: "Besagarahalli",
    landSize: "3.5",
    soilType: "Clay Soil",
    activeCrop: "Paddy",
    currentStage: "Setup",
    completedTasks: { Setup: ["Land Available"] }
  },
  {
    name: "Anita Patil",
    phone: "7766554433",
    email: "anita@farmer.com",
    password: "password123",
    district: "Belagavi",
    taluk: "Gokak",
    village: "Arabhavi",
    landSize: "12",
    soilType: "Black Soil",
    activeCrop: "Sugarcane",
    currentStage: "Harvest",
    completedTasks: {
      Setup: ["Land Available", "Water Source", "Irrigation Setup"],
      Cultivation: ["Sowing", "Pest Monitoring"],
      Harvest: ["Crop Maturity Check"]
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing dummy users to avoid duplicates
    await User.deleteMany({ phone: { $in: dummyUsers.map(u => u.phone) } });

    for (let u of dummyUsers) {
      u.password = await bcrypt.hash(u.password, 10);
      await User.create(u);
    }

    console.log("✅ Successfully added 3 dummy farmers to the database!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
