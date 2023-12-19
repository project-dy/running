const app = require('express').Router(); // express의 Router 함수의 반환 값을 app에 저장

/*function loadRouter() {
  const game = require('./game/register');
  app.use('/game', game);
  return app;
}*/

const game = require('./game/register'); // game경로 부분을 가져옴
app.use('/game', game); // 등록

const api = require('./api/register'); // api경로 부분을 가져옴
app.use('/api', api); // 등록

module.exports = app; // app을 모듈로 내보냄