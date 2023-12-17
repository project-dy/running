const app = require('express').Router(); // express의 Router 함수의 반환 값을 app에 저장

const find = require('../../src/game/find');

app.get("/find", (req, res) => {
  const result = find(req.query);
  res.writeHead(result[0], { 'Content-Type': 'application/json' });
  res.write(result[1]);
  res.end();
});

app.post('/', (req, res) => { // 게임방 생성할때 사용되는 라우터 등록
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
      });*/
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
      });/**/
    }
  });
});

module.exports = app; // app을 모듈로 내보냄