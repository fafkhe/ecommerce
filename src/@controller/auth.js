import authorizeUser from "../@lib/auth/authorize-user";
import Models from "../@models";
import AppError from "../@lib/server/appError";

const { User } = Models;

export default {
  signUp: async (req, res, next) => {
    if (!req.body.name || !req.body.email)
      throw new AppError("bad request: insufficient input");
    console.log(req.body.name);
    const thisUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: "1111",
    });

    // console.log(thisUser);
    const token = thisUser._createToken();
    // console.log(token);
    await thisUser.save();

    res.status(201).json({
      token,
    });
  },
};
