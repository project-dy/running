const app = require("express").Router(); // express의 Router 함수의 반환 값을 app에 저장
const fs = require('fs'); // fs 모듈 불러오기
const path = require('path'); // path 모듈 불러오기

app.get("/", (req, res) => {
  res.send(req.ip);
  res.end();
});

app.get("/name", (req, res) => {
  const account = fs.readFileSync(path.resolve('data/account.json'));
  const accountJson = JSON.parse(account);
  let ipList = [];
  accountJson.users.forEach((user) => {
    ipList[user.ip] = user.name;
  });
  res.send(ipList[req.ip]);
  res.end();
});

module.exports = app; // app을 모듈로 내보냄