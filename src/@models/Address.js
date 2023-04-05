import mongoose, { Schema } from "mongoose";

const AddressSchema = Schema(
  {
    text: String,
    name: String,
    phone: String,
    geo: { lat: Number, lon: Number },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", AddressSchema);
