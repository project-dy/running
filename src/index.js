const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send(`
<html>
<head>
<title>My first express app</title>
</head>
<body>
<h1>My first express app</h1>
<p>Welcome to my first express app</p>
</body>
</html>`));

app.listen(port,()=>{
  console.log(`Example app listening at http://localhost:${port}.`);
});