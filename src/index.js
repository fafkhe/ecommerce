import runServer from "./@lib/server/run-server";

globalThis.flr = (args) => {
  console.log("\x1b[41m", args);
  console.log("\x1b[40m");
};

globalThis.flg = (args) => {
  console.log("\x1b[42m", args);
  console.log("\x1b[40m");
};

runServer();
