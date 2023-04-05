import mongoose, { Schema } from "mongoose";

const InvoiceSchema = Schema(
  {
    userId: String,
    items: [
      {
        productId: String,
        price: String,
        quantity: Number,
        totalPrice: Number,
      },
    ],
    totalPrice: Number,
    addressId: String,
    status: {
      type: String,
      enum: ["paid", "boxed", "sent", "delivered"],
    },
    code: String,
    boxedby: { type: String, default: null }, //
    transmitter: { type: String, default: null },
    shipper: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Invoice", InvoiceSchema);
