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
          min: [1, "a valid quantity should be between 1-10"],
          max: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
