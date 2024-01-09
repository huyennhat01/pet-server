const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    name: { type: String, min: 8, max: 40, required: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let roleModel = mongoose.model("role", roleSchema);

module.exports = { roleModel };
