const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  days: Array,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Progress", ProgressSchema);
