import Models from "@models";
import AppError from "../@lib/server/appError";
import authorizeUser from "../@lib/auth/authorize-user";

const { Address } = Models;

export default {
  addAdress: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const { text, name, phoneNumber, geo } = req.body;
    if (!text || !name || !phoneNumber)
      throw new AppError("insufficient fields");
    const newAddress = await Address.create({
      userId: String(thisUser._id),
      name,
      text,
      phoneNumber,
      geo,
    });
    res.status(200).json({
      msg: "ok",
    });
  },

  getAddress: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const page = req.query.page || 0;
    const limit = req.query.limit || 2;

    const findOption = { userId: String(thisUser._id) };

    const [total, result] = await Promise.all([
      Address.find(findOption).countDocuments(),
      Address.find(findOption)
        .skip(page * limit)
        .limit(limit),
    ]);

    res.status(200).json({
      msg: "ok",
      data: {
        total,
        result,
      },
    });
  },
};
