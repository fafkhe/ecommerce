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

    boxedby: { type: String, default: null }, //
    boxDate: { type: Date, default: null },
    sender: { type: String, default: null },
    sendDate: { type: Date, default: null },
    shipment: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Invoice", InvoiceSchema);
