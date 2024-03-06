const express = require('express'); // express 모듈 로드
const fs = require('fs'); // fs 모듈 로드
const bodyParser = require('body-parser'); // POST요청 처리위한 body-parser 모듈 로드
const app = express(); // express app 생성
let port = 3000; // 포트 설정

const morgan = require('morgan'); // morgan 모듈 로드

app.use(morgan('dev')); // morgan 미들웨어 등록

/*app.get('/', (req, res) => res.send(`
<html>
<head>
<title>My first express app</title>
</head>
<body>
<h1>My first express app</h1>
<p>Welcome to my first express app</p>
</body>
</html>`));*/

const path = require('path').posix; // path 모듈 posix형식을 사용하도록 로드
const publicPath = path.resolve(__dirname, '../public').toString(); // public 폴더의 절대경로를 publicPath에 저장
const dataPath = path.resolve(__dirname, '../data').toString(); // data 폴더의 절대경로를 dataPath에 저장
// app.get('/', (req, res) => res.sendFile(`${publicPath}/index.html`));

checkRequiredFiles(dataPath); // 필수파일 존재여부 확인 및 생성

// getRoutePath(publicPath, app); // publicPath의 하위 폴더를 탐색하여 폴더가 아닌 경우 라우터를 생성, 폴더인경우 재귀하여 라우터를 자동으로 등록

app.use(bodyParser.urlencoded({ extended: true })); // POST요청 처리위한 body-parser 모듈 등록

const register = require('../routers/register'); // 라우터 로드
// register(app); // 라우터 등록
app.use('/', register); // 라우터 등록

app.use('/rs', (req,res) => {
  res.send(`
  <script>location.replace('https://scratch.mit.edu/projects/924834379');</script>
  `);
});

app.use((req, res, next) => { // priv가 포함된 경로로 접속시 403 Forbidden을 출력하도록 설정
  req.url.toString().includes('priv') ? res.status(403).send('403 Forbidden') : next(); // priv가 포함된 경로로 접속시 403 Forbidden을 출력 아닐경우 다음 미들웨어로 이동
}); // priv가 포함된 경로로 접속시 403 Forbidden을 출력하도록 설정

/*? 정적파일이란 서버에서 가지고 있는 파일을 그대로 클라이언트에게 전송하는 것임. ?*/
app.use('/', express.static(publicPath)); // publicPath를 기본경로로 하는 정적파일 미들웨어 등록


/*app.get('/game/find', (req, res) => { // 게임방 찾을때 사용되는 라우터 등록
  console.log(req.query); // 쿼리 확인
  if (req.query.gameId != undefined) { // 쿼리에 gameId가 존재하는 경우
    console.log("exist"); // 존재한다고 출력
    const gameId = req.query.gameId; // gameId에 쿼리의 gameId를 저장
    fs.readFile(path.resolve(publicPath, '../data/game.json'), (err, data) => { // game.json을 읽어옴
      if (err) throw err; // 오류 발생시 오류 출력
      const game = JSON.parse(data); // game.json을 JSON형식으로 파싱하여 game 변수에 저장
      console.log(game); // game 변수 출력
      game.games.forEach((game) => { // game.games의 각각의 game에 대하여 아래 코드 실행
        if (game.gameId === gameId) { // game.gameId가 gameId와 같은 경우
          console.log("exist"); // 존재한다고 출력
          sendIt(`200 OK`, game); // 200 OK와 game을 보냄
          return; // 함수 종료
        }
      });
      // 존재하지 않는 경우 (위에서 존재하는 경우 함수를 종료시켰기 때문에 이 코드는 존재하지 않는 경우에만 실행됨)
      sendIt(`404 Not Found`, null); // 404 Not Found와 null을 보냄
      /**
       * 
       * @param {String} status 상태 코드와 정보를 담은 문자열
       * @param {*} game 실제로 보내야할 정보
       */
      /*
      function sendIt(status, game) { // sendIt 함수 정의
        res.writeHead(200, { 'Content-Type': 'application/json' }); // 헤더 설정
        res.write(JSON.stringify({ status, game })); // status와 game을 JSON형식으로 변환하여 보냄
        res.end(); // 응답 종료
      }
    });
  } else {
    fs.readFile(path.resolve(publicPath, '../data/game.json'), (err, data) => { // game.json을 읽어옴
      if (err) throw err; // 오류 발생시 오류 출력
      const game = JSON.parse(data); // game.json을 JSON형식으로 파싱하여 game 변수에 저장
      console.log(game); // game 변수 출력
      if (game.games.length === 0) { // game.games의 길이가 0인 경우
        sendIt(`404 Not Found`, null); // 404 Not Found와 null을 보냄
        return; // 함수 종료
      } else { // game.games의 길이가 0이 아닌 경우
        sendIt(`205 Reset Content`, game.games); // 205 Reset Content와 game.games를 보냄
      }
      function sendIt(status, game) { // sendIt 함수 정의
        res.writeHead(200, { 'Content-Type': 'application/json' }); // 헤더 설정
        res.write(JSON.stringify({ status, game })); // status와 game을 JSON형식으로 변환하여 보냄
        res.end(); // 응답 종료
      }
    });
  }
});*/

/*app.post('/game/', (req, res) => { // 게임방 생성할때 사용되는 라우터 등록
  let sended = 0; // 응답을 보냈는지 확인하는 변수
  console.log(path.resolve(publicPath, '../data/account.json')); // account.json의 절대경로 출력
  fs.readFile(path.resolve(publicPath, '../data/account.json'), (err, data) => { // account.json을 읽어옴
    if (err) throw err; // 오류 발생시 오류 출력
    const account = JSON.parse(data); // account.json을 JSON형식으로 파싱하여 account 변수에 저장
    console.log(account.users); // account.users 출력
    account.users.forEach((user) => { // account.users의 각각의 user에 대하여 아래 코드 실행
      if ((user.name === req.body.name || user.sn === req.body.sn) && sended === 0) { // user.name이 req.body.name과 같거나 user.sn이 req.body.sn과 같고 sended가 0인 경우
        console.log("exist"); // 존재한다고 출력
        sendIt(`200 OK`, req.body); // 200 OK와 req.body를 보냄
        sended = 1; // sended를 1로 설정
      }
    });
    if (sended === 0) {  // sended가 0인 경우
      account.users.push(req.body); // account.users에 req.body를 추가
      fs.writeFileSync(path.resolve(publicPath, '../data/account.json'), JSON.stringify(account)); // account.json에 account를 JSON형식으로 변환하여 저장
      console.log("write"); // write 출력
      sendIt(`200 OK`, req.body); // 200 OK와 req.body를 보냄
      sended = 1; // sended를 1로 설정
    }
    
    function sendIt(status, user) {
      console.log(user); // user 출력
      /*fs.readFile(path.resolve(publicPath, '../public/game/index.html'), (err, data) => {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let dataString = data.toString();
        dataString = dataString.replace(`  <script src="js/verify.js"></script>`, `  <script src="js/verify.js"></script>
        <script type="text/javascript">
        const name = '${user.name}';
        const sn = '${user.sn}';
        window.name = name;
        window.sn = sn;
        fetch('main/js/index.js')
        .then(response => response.text())
        .then(script => eval(script))
        .catch(error => console.log(error));
        </script>`);
        // console.log(dataString);
        res.write(dataString);
        res.end();
      });*//*
      fs.readFile(path.resolve(publicPath, '../public/game/main/private.html'), (err, data) => { // private.html을 읽어옴
        if (err) throw err; // 오류 발생시 오류 출력
        res.writeHead(200, { 'Content-Type': 'text/html' }); // 헤더 설정
        let dataString = data.toString(); // data를 문자열로 변환하여 dataString에 저장
        dataString = dataString.replace(`  <script src="main/js/index.js"></script>`, `  <script src="main/js/index.js"></script>
        <script type="text/javascript">
        const name = '${user.name}';
        const sn = '${user.sn}';
        window.name = name;
        window.sn = sn;
        fetch('main/js/index.js')
        .then(response => response.text())
        .then(script => eval(script))
        .catch(error => console.log(error));
        </script>`); // dataString에서 `  <script src="main/js/index.js"></script>`를 `  <script src="main/js/index.js"></script>로 대체하고, 사용자 정보를 삽입
        // console.log(dataString);
        res.write(dataString); // dataString을 보냄
        res.end(); // 응답 종료
      });/**//*
    }
  });
});*/

const server = app.listen(port,()=>{
  console.log(`Express app listening at http://localhost:${port}.`); // express 서버가 오류없이 실행되면 출력
});

const webSocketServer = require('./socket/index'); // socket 모듈 로드
webSocketServer(server); // socket 서버 실행

/**
 * 
 * @param {String} publicPath 라우터를 생성하기 위해 탐색할 기본경로를 넣으십시오.
 * @returns Nothing.
 * @description publicPath의 하위 폴더를 탐색하여 폴더가 아닌 경우 라우터를 생성, 폴더인경우 재귀하여 라우터를 자동으로 등록합니다.
 * @example getRoutePath(path.resolve(__dirname, '../public').toString());
 */
function getRoutePath(publicPath, app) {
  fs.readdirSync(publicPath).forEach(file => { // publicPath의 하위 폴더를 탐색
    try {
      fs.readdirSync(path.resolve(publicPath, file)); // 폴더가 아닌 경우 오류 발생시켜 catch 구문 실행
      getRoutePath(path.resolve(publicPath, file)); // 폴더인 경우 재귀하여 라우터를 자동으로 등록
    } catch {
      if (file.includes('priv')) { // priv가 포함된 경우
        return; // 라우터 생성하지 않고 종료
      }
      const routePath = path.resolve(publicPath, file).toString().split('public')[1]; // 라우터 경로 설정
      console.log(`routePath: ${routePath}`); // 라우터 경로 출력
      app.get(routePath, (req, res)=>{res.sendFile(`${path.resolve(publicPath, file).toString()}`)}) // 라우터 등록
      if (file === 'index.html') { // index.html인 경우
        app.get(path.resolve(publicPath, file).toString().split('public')[1].split('index.html')[0], (req, res) => res.sendFile(`${path.resolve(publicPath, file).toString()}`)); // /index.html을 제외한 경로로 접속시 index.html을 전송하도록 라우터 등록
      }
    }
  });
}

/**
 * 
 * @param {String} dataPath 필수파일 존재여부를 확인할 dadta폴더의 기본경로를 넣으십시오.
 * @returns Nothing.
 * @description 필수파일 존재여부를 확인하고, 없는 경우 생성합니다.
 * @example checkRequiredFiles(path.resolve(__dirname, '../data').toString());
 */
function checkRequiredFiles(dataPath) {
  fs.existsSync(dataPath) || fs.mkdirSync(dataPath);
  const files = fs.readdirSync(dataPath);
  if (files.includes('account.json')) {
    console.log('Found required file: account.json');
    // return;
  } else {
    // 파일 생성
    fs.writeFileSync(path.resolve(dataPath, 'account.json'), '{"users": [{"name": "default", "sn": "00000000"}]}');
    console.log('Created required file: account.json');
  }

  if (files.includes('game.json')) {
    console.log('Found required file: game.json');
    // return;
  } else {
    // 파일 생성
    fs.writeFileSync(path.resolve(dataPath, 'game.json'), '{"games": [{"gameId": "1", "description": "Room Number 1."}]}');
    console.log('Created required file: game.json');
  }

  if (files.includes('ban.json')) {
    console.log('Found required file: ban.json');
    // return;
  } else {
    // 파일 생성
    fs.writeFileSync(path.resolve(dataPath, 'ban.json'), '{"ban": []}');
    console.log('Created required file: ban.json');
  }
}
