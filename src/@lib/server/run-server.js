import express from "express";
import "./run-db";
import _applyMiddlewares from "./../server/middleware"
import _applyRoutes from "./../../@router";

export default () => {
  const app = express();
  _applyMiddlewares(app);

  _applyRoutes(app);
  app.listen(4000, () => console.log("app is running on port 4000 "));
}; 


// import "./run-db";
// import _applyMiddlewares from "./middlewares";
// import _applyRoutes from "@router";

// export default () => {
//   const app = express();

//   _applyMiddlewares(app);
//   _applyRoutes(app);

//   app.listen(3000, () => console.log("app is running on port 3000"));
// };
