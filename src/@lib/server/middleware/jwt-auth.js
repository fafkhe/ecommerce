import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default (auth) => {
  const arr = auth.split(" ");
  if (arr.length != 2 || arr[0] != "ut") throw new AppError("unathorized", 401);

  try {
    return jwt.verify(arr[1], process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("unathorized", 401);
  }
};