import Models from "@models";
import AppError from "../@lib/server/appError";
import authorizeUser from "../@lib/auth/authorize-user";
import authorizeAdmin from "../@lib/auth/authorize-admin";
import decideUser from "@lib/auth/decide-user";

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
      status: "boxed",
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
  getMyInvoices: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const page = req.query.page || 0;
    const limit = req.query.limit || 2;
    const status = req.query.status || null;

    const junctionBox = {
      'new': { createdAt: 1 },
      'old': { createdAt: -1 },
      'price': { totalPrice: 1}
    }

    let x = req.query.sort || null

    const findOption = {
      userId: String(thisUser._id)
    };

    if (status) {
      findOption.status = status;
    }

    const [total, result] = await Promise.all([
      Invoice.find(findOption).countDocuments(),
      Invoice.find(findOption)
        .sort(junctionBox[x] || {createdAt: 1})
        .skip(page * limit)
        .limit(limit),
    ]);

    res.status(200).json({
      data: {
        total,
        result,
      },
    });
  },
  getAllInvoicesByAdmin: async (req, res, next) => {
    await authorizeAdmin(req.user);
    const page = req.query.page || 0;
    const limit = req.query.limit || 10;
    const status = req.query.status || null;
    const userId = req.query.userId;

    const findOption = {};

    if (status) findOption.status = status;
    if (userId) findOption.userId = userId;

    const [total, result] = await Promise.all([
      Invoice.find(findOption).countDocuments(),
      Invoice.find(findOption)
        .skip(page * limit)
        .limit(limit),
    ]);

    res.status(200).json({
      data: {
        total,
        result,
      },
    });
  },
  getSingleInvoice: async (req, res, next) => {
    const requester = await decideUser(req.user);

    const junctionBox = {
      user: async () => {
        const [SingleInvoice] = await Promise.all([
          Invoice.findById(req.params._id),
        ]);

        if (!SingleInvoice) throw new AppError("no such invoivce exists!", 404);

        if (SingleInvoice.userId !== String(thisUser._id))
          throw new AppError("forbidden", 403);

        res.status(200).json({
          data: SingleInvoice,
        });
      },
      admin: async () => {
        const [SingleInvoice] = await Promise.all([
          Invoice.findById(req.params._id),
        ]);

        if (!SingleInvoice) throw new AppError("no such invoivce exists!", 404);

        res.status(200).json({
          data: SingleInvoice,
        });
      },
    };

    if (
      !junctionBox[requester.role] ||
      typeof junctionBox[requester.role] !== "function"
    )
      throw new AppError("zxc", 400);

    await junctionBox[requester.role]();
  },
};
