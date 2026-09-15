const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    activity: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Expense", "Task", "Note", "Income"],
      default: "Task",
    },
    amount: {
      type: Number,
      default: 0,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
