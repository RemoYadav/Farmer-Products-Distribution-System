// // models/Notification.js
const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
//   receiverRole: {
//     type: String, // "farmer" or "customer"
//     required: true
//   },
//   type: {
//     type: String, // urgent, info, success, warning
//     default: "info"
//   },
//   title: String,
//   message: String,
//   action: String,
//   isRead: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Notification", notificationSchema);
const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ["ORDER_PLACED", "ORDER_STATUS", "PRODUCT_UPDATE"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
