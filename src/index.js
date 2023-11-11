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

// app.get('/', (req, res) => res.sendFile(`${publicPath}/index.html`));

function getRoutePath(publicPath) {
  fs.readdirSync(publicPath).forEach(file => {
    try {
      fs.readdirSync(path.resolve(publicPath, file)); // 폴더가 아닌 경우 오류 발생시켜 catch 구문 실행
      getRoutePath(path.resolve(publicPath, file));
    } catch {
      const routePath = path.resolve(publicPath, file).toString().split('public')[1];
      console.log(`routePath: ${routePath}`);
      app.get(routePath, (req, res)=>{res.sendFile(`${path.resolve(publicPath, file).toString()}`)})
      if (file === 'index.html') {
        app.get(path.resolve(publicPath, file).toString().split('public')[1].split('index.html')[0], (req, res) => res.sendFile(`${path.resolve(publicPath, file).toString()}`));
      }
    }
  });
}

getRoutePath(publicPath);

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/game/', (req, res) => {
  let sended = 0;
  console.log(path.resolve(publicPath, '../data/account.json'));
  fs.readFile(path.resolve(publicPath, '../data/account.json'), (err, data) => {
    if (err) throw err;
    const account = JSON.parse(data);
    console.log(account.users);
    account.users.forEach((user) => {
      if ((user.id === req.body.id || user.sn === req.body.sn) && sended === 0) {
        res.send(`200 OK`);
        sended = 1;
      }
    });
    if (sended === 0) {
      account.users.push(req.body);
      fs.writeFileSync(path.resolve(publicPath, '../data/account.json'), JSON.stringify(account));
      res.send(`200 OK`);
    }
  });
  // TODO: 게입창 전송. 데이터삽입필요.
});

app.listen(port,()=>{
  console.log(`Express app listening at http://localhost:${port}.`);
});