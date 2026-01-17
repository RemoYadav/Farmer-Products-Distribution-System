
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true
    },
    // email: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "lb" },
    stock: { type: Number, required: true },
    description: String,
    image: String,
    access:{
      type:String,
      enum: ["allowed", "denied"],
      default:"allowed"
    } // base64 OR image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

