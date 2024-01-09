const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      min: 6,
      max: 40,
    },
    password: { type: String, required: true, min: 8 },
    name: { type: String, required: true, min: 4, max: 40 },

    photo: { type: String },
    phone: {
      type: String,
      min: 10,
      max: 10,
      unique: true,
    },
    address: { type: String, min: 10 },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "role",
    },

    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "status",
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  },
  {
    timestamps: true,
  }
);

let adminModel = mongoose.model("admin", adminSchema);

module.exports = { adminModel };
