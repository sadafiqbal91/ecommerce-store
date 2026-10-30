const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        image: String,
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    address: {
      fullName: String,
      phone: String,
      city: String,
      line: String,
    },
    paymentMethod: { type: String, default: "Mock Card" },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);