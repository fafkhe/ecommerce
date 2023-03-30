import authorizeUser from "../@lib/auth/authorize-user";
import authorizeAdmin from "../@lib/auth/authorize-admin";
import Models from "../@models";
import AppError from "../@lib/server/appError";

const { Product } = Models;

export default {
  createProduct: async (req, res, next) => {
    const { name, price, description, quantity, imgUrl } = req.body;
    if (!name || !price || !description || !quantity)
      throw new AppError("bad request: insufficient input");
    const thisUser = await authorizeAdmin(req.user);

    const newProduct = await Product.create({
      name,
      price,
      description,
      quantity,
      imgUrl,
    });
    res.status(200).json({
      data: newProduct,
    });
  },
  editProduct: async (req, res, next) => {
    const { name, price, description, quantity, imgUrl } = req.body;

    const [thisUser, thisProduct] = await Promise.all([
      authorizeAdmin(req.user),
      Product.findById(req.params._id),
    ]);
    if (!thisProduct) throw new AppError("bad request: no such product found");

    const updateProduct = await Product.findByIdAndUpdate(
      req.params._id,

      {
        name,
        price,
        description,
        quantity,
        imgUrl,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        updateProduct,
      },
    });
  },
  getallProduct: async (req, res, next) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 10;

    const findOption = {};

    const [total, result] = await Promise.all([
      Product.find(findOption).countDocuments(),
      Product.find(findOption)
        .skip(page * limit)
        .limit(limit),
    ]);

    res.status(201).json({
      status: "success",
      data: {
        total,
        result,
      },
    });
  },
};
