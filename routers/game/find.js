const app = require('express').Router(); // express의 Router 함수의 반환 값을 app에 저장

const find = require('../../src/game/find');

app.get("/find", (req, res) => {
  const result = find(req.query);
  res.writeHead(result[0], { 'Content-Type': 'application/json' });
  res.write(result[1]);
  res.end();
});

module.exports = app; // app을 모듈로 내보냄