const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      index: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    // Snapshot data
    customerName: String,
    customerEmail: String,
    customerPhone: String,

    productName: String,
    quantity: Number,
    unit: String,
    pricePerUnit: Number,
    totalPrice: Number,

    deliveryDate: Date,
    deliveryLocation: String,
    deliveryAddress: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "delivered", "cancelled"],
      default: "pending",
      index: true
    },

    notes: String,
    rejectionReason: String,

    approvedAt: Date,
    rejectedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
