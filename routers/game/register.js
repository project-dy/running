const app = require("express").Router(); // express의 Router 함수의 반환 값을 app에 저장

function loadRouter() {
  const find = require("./find");
  app.use("/find", find);

  const index = require("./index");
  app.use("/", index);
  return app;
}


const find = require("./find");
app.use("/find", find);

const index = require("./index");
app.use("/", index);


module.exports = app; // app을 모듈로 내보냄