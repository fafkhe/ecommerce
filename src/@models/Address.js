import mongoose, { Schema } from "mongoose";

const AddressSchema = Schema(
  {
    userId: String,
    text: String,
    name: String,
    phone: String,
    geo: { lat: Number, lon: Number },
    deleted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", AddressSchema);
