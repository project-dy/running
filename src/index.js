const express = require('express');
const fs = require('fs');
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

const path = require('path');
const publicPath = path.resolve(__dirname, '../public').toString();

// app.get('/', (req, res) => res.sendFile(`${publicPath}/index.html`));

function getRoutePath(publicPath) {
  fs.readdirSync(publicPath).forEach(file => {
    try {
      fs.readdirSync(path.resolve(publicPath, file));
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

app.listen(port,()=>{
  console.log(`Example app listening at http://localhost:${port}.`);
});