const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    //   index: true
    },

    farmName: {
      type: String,
      required: true,
      trim: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },rating: Number,
    email : {
        type : String,
        required : true,
        unique: true
        
    },

    phone: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    address: {
      type: String
    },

    city: {
      type: String
    },

    state: {
      type: String
    },

    zipCode: {
      type: String
    },

    farmSize: {
      type: String
    },

    farmingType: {
      type: String
    },

    yearsExperience: {
      type: String
    },

    organicCertified: {
      type: Boolean,
      default: false
    },

    bio: {
      type: String
    },

    image: {
      type: String
    }
  },
  {
    timestamps: true // creates createdAt & updatedAt
  }
);

module.exports = mongoose.model("Farmer", FarmerSchema);
