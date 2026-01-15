
const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
  type: String,
  unique: true,
  required: true
},

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
    email: String,
    phone: String,
    quantity: Number,
    unit: String,
    price: Number,
    totalPrice: Number,

    deliveryDate: Date,
    deliveryLocation: String,
     notes: String,
    // deliveryAddress: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "delivered", "cancelled"],
      default: "pending",
      index: true
    },

   
    rejectionReason: String,

    approvedAt: Date,
    rejectedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
