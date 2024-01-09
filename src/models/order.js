const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        status: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },

    orderStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderStatus",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let orderModel = mongoose.model("order", orderSchema);

module.exports = { orderModel };
