import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

const ProductSchema = Schema(
  {
    name: String,
    price: Number,
    description: String,
    quantity: Number,
    isDisplayed: Boolean,
    imgurl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);




export default mongoose.model("Product", ProductSchema);
