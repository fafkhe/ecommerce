import authorizeUser from "../@lib/auth/authorize-user";
import authorizeAdmin from "../@lib/auth/authorize-admin";
import Models from "../@models";
import AppError from "../@lib/server/appError";

const { User, Cart } = Models;

const permissionsMaker = (arr) => {
  const obj = {
    master: 1,
    userControll: 1,
    productControll: 1,
    boxing: 1,
    sending: 1,
    shipping: 1,
  };
  const result = [];

  arr.forEach((item) => {
    if (item in obj) result.push(item);
  });

  return [...new Set(result)];
};

export default {
  signUp: async (req, res, next) => {
    if (!req.body.name || !req.body.email)
      throw new AppError("bad request: insufficient input");
    const thisUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: "1111",
    });

    const token = thisUser._createToken();
    await thisUser.save();
    await Cart.create({
      userId: String(thisUser._id),
    });

    res.status(201).json({
      token,
    });
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || !email)
      throw new AppError("bad request: insufficient input", 400);

    const thisUser = await User.findOne({ email });
    if (!thisUser) throw new AppError("bad request: no such user found!", 404);

    thisUser._checkPassword(password);
    const token = thisUser._createToken();

    res.status(201).json({
      token,
    });
  },
  me: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);

    res.status(200).json(thisUser);
  },

  createAdmin: async (req, res, next) => {
    await authorizeAdmin(req.user, "userControll");
    const { name, email, imgUrl, password, permissions } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !permissions ||
      !Array.isArray(permissions)
    )
      throw new AppError("bad request: insufficient input");
    const newAdmin = await User.create({
      name,
      email,
      password,
      role: "admin",
      permissions: permissionsMaker(permissions),
    });
    res.status(200).json({
      msg: "success",
      data: newAdmin,
    });
  },

  adminMe: async (req, res, next) => {
    const thisUser = await authorizeAdmin(req.user);
    res.status(200).json(thisUser);
  },
};
