import authorizeUser from "../@lib/auth/authorize-user";
import authorizeAdmin from "../@lib/auth/authorize-admin";
import Models from "../@models";
import AppError from "../@lib/server/appError";

const { Product } = Models;

export default {
  createProduct: async (req, res, next) => {
    const { name, price, description, quantity, imgUrl } = req.body;
    if(!name || !price|| !description || !quantity ) throw new AppError("bad request: insufficient input")
    const thisUser = await authorizeAdmin(req.user);
    if (!thisUser) throw new AppError("you can not create product", 403);

    const newProduct =  await Product.create({
      name,
      price,
      description,
      quantity,
      imgUrl
    });
    res.status(200).json({
      data: newProduct,
    })
  },
};
