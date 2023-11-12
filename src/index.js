const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

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

const path = require('path').posix;
const publicPath = path.resolve(__dirname, '../public').toString();
const dataPath = path.resolve(__dirname, '../data').toString();
// app.get('/', (req, res) => res.sendFile(`${publicPath}/index.html`));

checkRequiredFiles(dataPath);

getRoutePath(publicPath);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/game/find', (req, res) => {
  console.log(req.query);
  if (req.query.gameId != undefined) {
    console.log("exist");
    const gameId = req.query.gameId;
    fs.readFile(path.resolve(publicPath, '../data/game.json'), (err, data) => {
      if (err) throw err;
      const game = JSON.parse(data);
      console.log(game);
      game.games.forEach((game) => {
        if (game.gameId === gameId) {
          console.log("exist");
          sendIt(`200 OK`, game);
          return;
        }
      });
      sendIt(`404 Not Found`, null);
      function sendIt(status, game) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status, game }));
        res.end();
      }
    });
  } else {
    fs.readFile(path.resolve(publicPath, '../data/game.json'), (err, data) => {
      if (err) throw err;
      const game = JSON.parse(data);
      console.log(game);
      if (game.games.length === 0) {
        sendIt(`404 Not Found`, null);
        return;
      } else {
        sendIt(`205 Reset Content`, game.games);
      }
      function sendIt(status, game) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ status, game }));
        res.end();
      }
    });
  }
});

app.post('/game/', (req, res) => {
  let sended = 0;
  console.log(path.resolve(publicPath, '../data/account.json'));
  fs.readFile(path.resolve(publicPath, '../data/account.json'), (err, data) => {
    if (err) throw err;
    const account = JSON.parse(data);
    console.log(account.users);
    account.users.forEach((user) => {
      if ((user.name === req.body.name || user.sn === req.body.sn) && sended === 0) {
        console.log("exist");
        sendIt(`200 OK`, req.body);
        sended = 1;
      }
    });
    if (sended === 0) {
      account.users.push(req.body);
      fs.writeFileSync(path.resolve(publicPath, '../data/account.json'), JSON.stringify(account));
      console.log("write");
      sendIt(`200 OK`, req.body);
      sended = 1;
    }
    
    function sendIt(status, user) {
      console.log(user);
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
      });*/
      fs.readFile(path.resolve(publicPath, '../public/game/main/private.html'), (err, data) => {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let dataString = data.toString();
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
        </script>`);
        // console.log(dataString);
        res.write(dataString);
        res.end();
      });/**/
    }
  });
});

app.listen(port,()=>{
  console.log(`Express app listening at http://localhost:${port}.`);
});

/**
 * 
 * @param {String} publicPath 라우터를 생성하기위해 탐색할 기본경로를 넣으십시오.
 * @returns Nothing.
 * @description publicPath의 하위 폴더를 탐색하여 폴더가 아닌 경우 라우터를 생성, 폴더인경우 재귀하여 라우터를 자동으로 등록합니다.
 * @example getRoutePath(path.resolve(__dirname, '../public').toString());
 * @description 솅조ᇰᅌᅥᆼ졩훈민져ᇰᅙᅳᆷ
나랏말ᄊᆞ미
듀ᇰ귁에달아
문ᄍᆞᆼ와로서르ᄉᆞᄆᆞᆺ디아니ᄒᆞᆯᄊᆡ
이런젼ᄎᆞ로어린ᄇᆡᆨ셔ᇰ이니르고져호ᇙ배이셔도
ᄆᆞᄎᆞᆷ내제ᄠᅳ들시러펴디몯ᄒᆞᇙ노미하니라
내이ᄅᆞᆯ윙ᄒᆞ야어엿비너겨
새로스믈여듧ᄍᆞᆼᄅᆞᆯᄆᆡᇰᄀᆞ노니
사ᄅᆞᆷ마다ᄒᆡᅇᅧ수ᄫᅵ니겨날로ᄡᅮ메뼌ᅙᅡᆫ킈ᄒᆞ고져ᄒᆞᇙᄯᆞᄅᆞ미니라

세종어제훈민정음
나랏말이 중국과 문자와로 알맞지 아니하다
이 때문에 어린 백성이 말하고자 하여도
마참내 제 뜻을 혀지 못하니라
내 이를 가엽게 여겨
새로 스믈 여덟자를 만드노니
사람마다 하여 쉽게 익혀 날로 씀에 편하게 하고자 할 뿐이니라
 */
function getRoutePath(publicPath) {
  fs.readdirSync(publicPath).forEach(file => {
    try {
      fs.readdirSync(path.resolve(publicPath, file)); // 폴더가 아닌 경우 오류 발생시켜 catch 구문 실행
      getRoutePath(path.resolve(publicPath, file));
    } catch {
      if (file.includes('private')) {
        return;
      }
      const routePath = path.resolve(publicPath, file).toString().split('public')[1];
      console.log(`routePath: ${routePath}`);
      app.get(routePath, (req, res)=>{res.sendFile(`${path.resolve(publicPath, file).toString()}`)})
      if (file === 'index.html') {
        app.get(path.resolve(publicPath, file).toString().split('public')[1].split('index.html')[0], (req, res) => res.sendFile(`${path.resolve(publicPath, file).toString()}`));
      }
    }
  });
}

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
}