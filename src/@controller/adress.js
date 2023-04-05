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

  getMyAddresses: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const page = req.query.page || 0;
    const limit = req.query.limit || 2;

    const findOption = { userId: String(thisUser._id), deleted: false };

    const [total, result] = await Promise.all([
      Address.find(findOption).countDocuments(),
      Address.find(findOption)
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

  deleteMyAddress: async (req, res, next) => {
    const [thisUser, thisAddress] = await Promise.all([
      authorizeUser(req.user),
      Address.findById(req.body._id),
    ]);

    if (!thisAddress)
      throw new AppError("bad request: no such address exist!", 404);
    if (thisAddress.userId !== String(thisUser._id))
      throw new AppError("forbiden", 403);
    await Address.findByIdAndUpdate(thisAddress._id, {
      $set: { deleted: true },
    });
    res.status(200).json({
      msg: "ok",
    });
  },
};
