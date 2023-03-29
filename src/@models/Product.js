import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

const ProductSchema = Schema(
  {
    name: String,

    price: String,
    description: String,
    quantity: String,
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

// price: String,
//       quantity: String,
//       description: String,
//       isDisplayed: Boolean,
//       keywords: [String],
