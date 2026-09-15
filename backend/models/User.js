const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: String,
    otpExpires: Date,
    state: {
      type: String,
      default: "Karnataka",
    },
    district: String,
    taluk: String,
    village: String,
    soilType: String,
    landSize: String,
    lat: Number,
    lon: Number,
    activeCrop: {
      type: String,
      default: "",
    },
    currentStage: {
      type: String,
      default: "Setup",
    },
    completedTasks: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);