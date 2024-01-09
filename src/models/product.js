const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 100,
    },
    photos: [{ type: String, required: true }],
    author: { type: String,  min: 1, max: 100 },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    purchases: { type: Number, min: 0, default: 0 },
    rates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rate",
      },
    ],
    star: { type: Number, default: 5.0 },
    sale: { type: Number, default: 0.0 },
    description: { type: String, required: true, min: 6, max: 5000 },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "categories",
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "status",
    },
    extraPerson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "admin",
    },
  },
  {
    timestamps: true,
  }
);

let productModel = mongoose.model("product", productSchema);

module.exports = { productModel };
