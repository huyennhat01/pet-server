const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: { type: String, min: 4, max: 50, required: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "status",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let categoriesModel = mongoose.model("categories", categoriesSchema);

module.exports = { categoriesModel };
