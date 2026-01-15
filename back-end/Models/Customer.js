const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim : true
    },
    phone: String,
    location: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
