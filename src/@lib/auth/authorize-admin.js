import AppError from "../server/appError";
import Models from "../../@models";

const { User } = Models;

export default async (user, str) => {
  if (!user || !user._id) throw new AppError("unathorized", 401);

  const thisAdmin = await User.findOne(
    { _id: user._id, role: "admin" },
    { __v: 0, password: 0 }
  );

  if (!thisAdmin) throw new AppError("forbidden", 403);

  const hasPermission = thisAdmin.permissions.some((item) => {
    return item === "master" || item === str;
  });

  if (str && !hasPermission) throw new AppError("forbidden", 403);

  return thisAdmin;
};
