import Models from "@models";
import AppError from "../@lib/server/appError";
import authorizeUser from "../@lib/auth/authorize-user";

const { Cart, Product } = Models;

const appendProduct = async (carts) => {
  const preproductIds = carts.map((item) => item.productId);
  const productIds = [...new Set(preproductIds)];
  const theseProducts = await Product.find({ _id: { $in: productIds } });

  const cache = {};

  theseProducts.forEach((product) => (cache[String(product._id)] = product));

  for (const thiscart of carts) {
    const thisProduct = cache[thiscart.productId];

    thiscart.product = thisProduct;
  }

  return carts;
};

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

    if (alreadyAdded)
      throw new AppError("you already add this product to cart", 400);

    if (thiscart.items.length >= 10)
      throw new AppError("the maximum product is 10 , you can not add !", 400);
    await Cart.findByIdAndUpdate(thiscart._id, {
      $push: { items: { productId: productId, quantity: 1 } },
    });

    res.status(200).json({
      msg: "ok",
    });
  },

  getCart: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const thisCart = await Cart.findOne({
      userId: String(thisUser._id),
    }).lean();

    const result = await appendProduct(thisCart.items);
    console.log(result);

    let totalPrice = 0;
    for (const thisProduct of result) {
      totalPrice += thisProduct.product.price * thisProduct.quantity;
    }

    res.status(200).json({
      data: {
        items: result,
        totalPrice,
      },
    });
  },

  changeTheQuantity: async (req, res, next) => {
    try {
      const { quantity: newQuantity } = req.body;
      if (newQuantity % 1 !== 0)
        throw new AppError("quantity should be an integer", 400);
      const [thisUser, thisProduct] = await Promise.all([
        authorizeUser(req.user),
        Product.findById(req.body._id),
      ]);
      if (!thisProduct) throw new AppError("no such product exist!", 404);
      const thisCart = await Cart.findOne({
        userId: String(thisUser._id),
      });
      const thisproduct = req.body._id;

      const Index = thisCart.items.findIndex(
        (item) => item.productId === thisproduct
      );

      if (Index === -1)
        throw new AppError("your cart does'nt contain this product", 404);

      thisCart.items[Index].quantity = newQuantity;
      await thisCart.save();

      res.status(200).json({
        msg: "ok",
      });
    } catch (error) {
      if (error.name === "CastError")
        throw new AppError("no such product exist!");
      throw error;
    }
  },
  removeProduct: async (req, res, next) => {
    const [thisUser, thisProduct] = await Promise.all([
      authorizeUser(req.user),
      Product.findById(req.body._id),
    ]);
    if (!thisProduct) throw new AppError("no such product exist!");
    const thiscart = await Cart.findOne({ userId: String(thisUser._id) });

    const thisproduct = req.body._id;

    const Index = thiscart.items.findIndex(
      (item) => item.productId === thisproduct
    );
    if (Index === -1)
      throw new AppError("your cart does'nt contain this product",404);

    await Cart.findByIdAndUpdate(thiscart._id, {
      $pull: { items: { productId: thisproduct } },
    });

    res.status(200).json({
      msg: "ok",
    });
  },
};
