import Models from "@models";
import AppError from "../@lib/server/appError";
import authorizeUser from "../@lib/auth/authorize-user";

const { Address, Invoice, Cart, Product } = Models;

export default {
  checkout: async (req, res, next) => {
    // const [addressId] = req.body;
    const thisUser = await authorizeUser(req.user);
    const thisCart = await Cart.findOne({
      userId: String(thisUser._id),
    }).lean();
    if (!thisCart.items.length)
      throw new AppError("bad request: your cart is empty!!! ", 400);
    const thisAddress = await Address.findById(req.body.addressId);
    if (!thisAddress)
      throw new AppError("bad request: no such address exists!", 404);
    if (thisAddress.userId !== String(thisUser._id))
      throw new AppError("this address is'nt for you");
    const x = thisCart.items.map((item) => item.productId);
    const productIds = [...new Set(x)];
    const theseProducts = await Product.find({ _id: { $in: productIds } });
    const cache = {};
    theseProducts.forEach((product) => (cache[String(product._id)] = product));

    const clone = structuredClone(thisCart.items);

    for (const item of clone) {
      const thisProduct = cache[item.productId];
      if (thisProduct.quantity < item.quantity)
        throw new AppError(
          "bad request: we have not enougth product in our store",
          400
        );
      delete item._id;
      item.price = thisProduct.price;
      item.totalPrice = thisProduct.price * item.quantity;
    }

    const newInvoice = await Invoice.create({
      userId: String(thisUser._id),
      items: clone,
      totalPrice: clone.reduce((acc, cur) => acc + cur.totalPrice, 0),
      addressId: String(thisAddress._id),
      status: "paid",
    });
    console.log("clone", clone);

    // for (const item of clone) {
    //   await Product.findByIdAndUpdate(item.productId, {
    //     $inc: { quantity: -item.quantity },
    //   });
    // }

    const promises = clone.map((item) => {
      return Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    });

    await Promise.all(promises);

    await Cart.findByIdAndUpdate(thisCart._id, { $set: { items: [] } });

    res.status(200).json({
      msg: "ok",
      InvoiceId: String(newInvoice._id),
    });
  },
};
