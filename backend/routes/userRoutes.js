const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Journal = require("../models/Journal");

// Update Farm Progress
router.post("/update-progress", async (req, res) => {
  try {
    const { phone, activeCrop, currentStage, completedTasks } = req.body;
    const user = await User.findOneAndUpdate(
      { phone },
      { activeCrop, currentStage, completedTasks },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add Journal Entry
router.post("/journal", async (req, res) => {
  try {
    const { phone, activity, category, amount, notes } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const entry = await Journal.create({
      userId: user._id,
      activity,
      category,
      amount,
      notes
    });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Journal Entries
router.get("/journal/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const entries = await Journal.find({ userId: user._id }).sort({ date: -1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
