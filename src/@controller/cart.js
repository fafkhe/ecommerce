import Models from "@models";
import AppError from "../@lib/server/appError";
import authorizeUser from "../@lib/auth/authorize-user";

const { Cart, Product } = Models;

export default {
  addtoCart: async (req, res, next) => {
    const [thisUser, thisProduct] = await Promise.all([
      authorizeUser(req.user),
      Product.findById(req.body._id),
    ]);

    if (!thisProduct) throw new AppError("no such product found", 404);

    const productId = String(thisProduct._id);

    const thiscart = await Cart.findOne({ userId: String(thisUser._id) });

    const alreadyAdded = thiscart.items.some(
      (cartItem) => cartItem.productId === productId
    );

    if (alreadyAdded) throw new AppError("you already add this product to cart", 400);

    if (thiscart.items.length >= 10)
      throw new AppError("the maximum product is 10 , you can not add !", 400);
    await Cart.findByIdAndUpdate(thiscart._id, {
      $push: { items: { productId: productId, quantity: 1 } },
    });
    res.status(200).json({
      msg: "ok",
    });
  },
};
