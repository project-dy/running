const app = require("express").Router(); // express의 Router 함수의 반환 값을 app에 저장

function loadRouter() {
  const find = require("./game/find");
  app.use("/find", find);

  const root = require("./game/index");
  app.use("/", root);
  return app;
}

module.exports = loadRouter; // app을 모듈로 내보냄