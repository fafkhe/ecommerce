import mongoose, { Schema } from "mongoose";

const CartSchema = Schema(
  {
    userId: {
      type: String,
    },
   
    items: [
      {
        productId: String, 
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
