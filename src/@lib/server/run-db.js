import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.set("debug", true); // debug mode on

dotenv.config();

const dburi = process.env.MONGODB_URI;

try {
  mongoose.connect(dburi);
} catch (err) {
  mongoose.createConnection(dburi);
}

mongoose.connection
  .once("open", () => console.log("MongoDB Running"))
  .on("error", (e) => {
    console.log(e);
    console.log("error in connection to mongodb");
  });
