const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      min: 6,
      max: 40,
    },
    password: { type: String, min: 8 },
    name: { type: String, required: true, min: 4, max: 40 },

    photo: { type: String },
    phone: {
      type: String,
      min: 10,
      max: 10,
    },
    address: { type: String, min: 10 },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "status",
    },
  },
  {
    timestamps: true,
  }
);

let userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
