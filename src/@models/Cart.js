import mongoose, { Schema } from "mongoose";

const CartSchema = Schema(
  {
    userId: {
      type: String,
    },

    items: [
      {
        productId: String,
        quantity: {
          type: Number,
          min: [1, "quantity should be an integer between 1-10"],
          max: [10, "quantity should be an integer between 1-10"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
