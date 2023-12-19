const app = require("express").Router(); // express의 Router 함수의 반환 값을 app에 저장

const getip = require("./getip");
app.use("/getip", getip);

module.exports = app; // app을 모듈로 내보냄