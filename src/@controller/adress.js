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
      name,
      text,
      phoneNumber,
      geo,
    });
    res.status(200).json({
      data: newAddress,
      msg: "ok",
    });
  },
 
  
};
