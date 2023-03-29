
import AppError from "../server/appError";
import Models from "../../@models";

const { User } = Models;

export default async (user) => {
  if (!user || !user._id) throw new AppError("unathorized", 401);

  const thisUser = await User.findOne(
    { id: id, role: "user" },
    { __v: 0, password: 0 }
  );

  if (!thisUser) throw new AppError("forbidden", 403);

  return thisUser;
};
