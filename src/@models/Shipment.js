import mongoose, { Schema } from "mongoose";

const ShipmentSchema = Schema(
  {
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default:"pending"
    },
    invoiceId: String,
    shipper: String,
    code: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Shipment", ShipmentSchema);
