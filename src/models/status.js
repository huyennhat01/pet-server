const mongoose = require("mongoose");
const statusSchema = new mongoose.Schema(
  {
    name: { type: String, min: 8, max: 40, required: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
let statusModel = mongoose.model("status", statusSchema);

module.exports = { statusModel };
