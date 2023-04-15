import Models from "@models";
import AppError from "../@lib/server/appError";
import authorizeUser from "../@lib/auth/authorize-user";
import authorizeAdmin from "../@lib/auth/authorize-admin";
import decideUser from "@lib/auth/decide-user";
import generateNumericString from "../@lib/utils/generateNumericString";

const { Address, Invoice, Cart, Product, Shipment } = Models;

const serializeInvoice = async (invoices, userId) => {
  const thisAddressId = invoices.map((item) => item.addressId);
  const addressIds = [...new Set(thisAddressId)];
  const theseAddress = await Address.find({ _id: { $in: addressIds } });
  const AddressCache = {};
  const ProductCache = {};
  theseAddress.forEach(
    (address) => (AddressCache[String(address._id)] = address)
  );

  for (const invoice of invoices) {
    const thisAddress = AddressCache[invoice.addressId];

    invoice.address = thisAddress;
  }
  const thesePro = invoices.map((item) => item.items);

  const newProList = thesePro.flat();

  const arrOfIds = [];

  for (let i = 0; i < newProList.length; i++) {
    arrOfIds.push(newProList[i].productId);
  }
  const theseProducts = await Product.find(
    { _id: { $in: arrOfIds } },
    { __v: 0, quantity: 0 }
  );

  theseProducts.forEach(
    (product) => (ProductCache[String(product._id)] = product)
  );
  for (const invoice of invoices) {
    invoice.items.forEach((item) => {
      item.product = ProductCache[item.productId];
    });
  }

  for (const invoice of invoices) {
    const amIhim = userId === invoice.userId;

    if (invoice.shipment) {
      const projection = amIhim ? undefined : { code: 0 };

      const thisShipment = await Shipment.findById(
        invoice.shipmentId,
        projection
      );

      invoice.shipment = thisShipment;
    }
  }

  return invoices;
};

const serializeSingleInvoide = async (invoice) => {
  const x = await serializeInvoice([invoice]);
  return x[0];
};

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

    // const junctionBox = {
    //   new: { createdAt: 1 },
    //   old: { createdAt: -1 },
    //   price: { totalPrice: 1 },
    // };

    // let x = req.query.sort || null;

    const findOption = {
      userId: String(thisUser._id),
    };

    if (status) {
      findOption.status = status;
    }

    const [total, result] = await Promise.all([
      Invoice.find(findOption).countDocuments(),
      Invoice.find(findOption)
        // .sort(junctionBox[x] || { createdAt: 1 })
        .skip(page * limit)
        .limit(limit)
        .lean(),
    ]);

    const result2 = await serializeInvoice(result);

    res.status(200).json({
      data: {
        total,
        result: result2,
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
        .limit(limit)
        .lean(),
    ]);
    console.log("//////////////////////////////", result);

    const result2 = await serializeInvoice(result);
    res.status(200).json({
      data: {
        total,
        result: result2,
      },
    });
  },
  getSingleInvoice: async (req, res, next) => {
    const requester = await decideUser(req.user);

    const junctionBox = {
      user: async () => {
        const [SingleInvoice] = await Promise.all([
          Invoice.findById(req.params._id).lean(),
        ]);

        if (!SingleInvoice) throw new AppError("no such invoivce exists!", 404);

        if (SingleInvoice.userId !== String(requester._id))
          throw new AppError("forbidden", 403);

        const data = await serializeSingleInvoide(SingleInvoice);

        res.status(200).json({
          data,
        });
      },
      admin: async () => {
        const [SingleInvoice] = await Promise.all([
          Invoice.findById(req.params._id).lean(),
        ]);

        if (!SingleInvoice) throw new AppError("no such invoivce exists!", 404);

        const data = await serializeSingleInvoide(SingleInvoice);

        res.status(200).json({
          data,
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

  boxOrder: async (req, res, next) => {
    const [thisInvoice, thisAdmin] = await Promise.all([
      Invoice.findOne({ _id: req.body.InvoiceId, status: "paid" }),
      authorizeAdmin(req.user, "boxing"),
    ]);

    if (!thisInvoice) throw new AppError("no such invoice found", 404);

    await Invoice.findByIdAndUpdate(thisInvoice._id, {
      $set: {
        status: "boxed",
        boxedby: String(thisAdmin._id),
        boxDate: new Date().toISOString(),
      },
    });

    res.status(200).json({ msg: "ok" });
  },

  sendOrder: async (req, res, next) => {
    const [thisAdmin, thisInvoice, thisShipper] = await Promise.all([
      authorizeAdmin(req.user, "sending"),
      Invoice.findOne({ _id: req.body.InvoiceId, status: "boxed" }),
      User.findById(req.body.shipperId),
    ]);

    if (!thisInvoice) throw new AppError("no such invoice found", 404);
    if (!thisShipper) throw new AppError("no such shipper found", 404);

    if (!thisShipper.permissions.some((item) => item == "shipping"))
      throw new AppError(
        "the selected shipper has not permision to ship invoices",
        400
      );

    const thisShipment = await Shipment.create({
      invoiceId: String(thisInvoice._id),
      shipper: String(thisShipper._id),
      code: generateNumericString(4),
    });

    await Invoice.findByIdAndUpdate(thisInvoice._id, {
      $set: {
        status: "sent",
        sender: String(thisAdmin._id),
        sendDate: new Date().toISOString(),
        shipmentId: String(thisShipment._id),
      },
    });

    res.status.json({
      msg: "ok",
    });
  },

  deliveredOrder: async (req, res, next) => {
    const [thisAdmin, thisInvoice] = await Promise.all([
      authorizeAdmin(req.user, "shipping"),
      Invoice.findOne({ _id: req.body.InvoiceId, status: "sent" }),
    ]);

    if (!thisInvoice) throw new AppError("no such invoice found", 404);
    const thisShipment = await Shipment.findById(thisInvoice.shipmentId);

    if (thisShipment.shipper !== String(thisAdmin._id))
      throw new AppError("forbidden", 403);

    if (req.body.code !== thisShipment.code)
      throw new AppError("bad request: wrong code!!!!", 400);
    await Promise.all([
      Invoice.findByIdAndUpdate(thisInvoice._id, {
        $set: { status: "delivered" },
      }),
      Shipment.findByIdAndUpdate(thisInvoice._id, {
        $set: { status: "delivered", code: null },
      }),
    ]);
    res.status(200).json({
      msg: "ok",
    });
  },
};
