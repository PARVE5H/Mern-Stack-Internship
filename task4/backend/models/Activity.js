const mongoose = require("mongoose");
const ActivitySchema = new mongoose.Schema({
  userId: String,
  website: String,
  timeSpent: Number,
  lastVisited: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Activity", ActivitySchema);
