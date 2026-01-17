const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["farmer", "customer", "admin"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status:{
      type: String,
      enum: ["active", "suspended"],
      default: "active" 
    },

    password: {
      type: String,
      required: true,
    },

    last_login: {
      type: Date,
      default: null,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
