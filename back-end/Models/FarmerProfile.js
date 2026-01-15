const mongoose = require("mongoose");

const farmerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    farmName: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    farmSize: {
      type: String,
      enum: ["small", "medium", "large", "xlarge"],
      required: true,
    },

    experience: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FarmerProfile", farmerProfileSchema);
