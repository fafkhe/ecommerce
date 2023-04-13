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

    await authorizeAdmin(req.user, "productControll");

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

    const [thisProduct] = await Promise.all([
      Product.findById(req.params._id),
      authorizeAdmin(req.user, "productControll"),
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

  allProducts: async (req, res, next) => {
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

  singleProduct: async (req, res, next) => {
    const singleProduct = await Product.findById(req.params._id);

    if (!singleProduct)
      throw new AppError("bad request: no such product found", 404);

    res.status(200).json({
      status: "success",
      data: singleProduct,
    });
  },
};
