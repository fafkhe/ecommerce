import mongoose, { Schema } from "mongoose";

const ShipmentSchema = Schema(
  {
    invoiceId: String,
    shipper: String,
    code: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Shipment", ShipmentSchema);
