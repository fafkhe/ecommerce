import authRouter from "./auth-router";
import product from "./product-router";
import Cart from "./cart-router";
import Address from "./adress-router";
import Checkout from "./checkout-router";
import Invoice from "./invoice-router";

export default (app) => {
  app.get("/", (req, res) => {
    res.send("hello from fafkhe");
  });

  app.use("/auth", authRouter);
  app.use("/product", product);
  app.use("/cart", Cart);
  app.use("/address", Address);
  app.use("/checkout", Checkout);
  app.use("/invoice", Invoice);

  app.all("*", (req, res, next) => {
    res.send("<h1>  404! </h1>");
  });

  app.use((err, req, res, next) => {
    flg(err.statusCode);
    res.status(err.statusCode || 500).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  });
};
