const mongoose = require("mongoose");

const loginActivitySchema = new mongoose.Schema({
    logId: {
  type: String,
  unique: true,
  required: true
},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  email: String,
  role: String,
  action: {
    type: String,
    enum: ["login", "logout"],
    required: true
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    required: true
  },
  ipAddress: String,
  userAgent: String,
  details: String
}, { timestamps: true });

module.exports = mongoose.model("LoginActivity", loginActivitySchema);
