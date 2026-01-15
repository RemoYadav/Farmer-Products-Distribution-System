const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    subject: String,
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
