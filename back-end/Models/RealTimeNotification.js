const mongoose = require("mongoose");

const RealTimeNotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("RealTimeNotification", RealTimeNotificationSchema);
