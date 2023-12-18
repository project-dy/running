const app = require('express').Router(); // express의 Router 함수의 반환 값을 app에 저장

function loadRouter() {
  const game = require('./game/register');
  app.use('/game', game);
  return app;
}

const game = require('./game/register');
app.use('/game', game);

module.exports = app; // app을 모듈로 내보냄