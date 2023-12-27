const WebSocket = require('ws');
const fs = require('fs'); // fs 모듈 불러오기
const path = require('path'); // path 모듈 불러오기
const publicPath = path.resolve(__dirname, '../../public'); // public 폴더의 절대경로를 publicPath에 저장

let ban = JSON.parse(fs.readFileSync(path.resolve(publicPath, '../data/ban.json'))).ban;

function webSocketServer( server ) {
  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });
  
  // Store connected clients
  const clients = [];
  // Handle incoming connections
  wss.on('connection', (ws, req) => {
    // Get the "rn" parameter from the request URL
    // const urlParams = new URLSearchParams(req.url);
    // const rn = urlParams.get('rn');
    const rn = req.url.split('?rn=')[1];
    // console.log(rn);

    // get the client ip address
    const ip = ws._socket.remoteAddress;
    // Store the WebSocket connection based on the "rn" parameter
    if (!clients[rn]) {
      clients[rn] = [];
    }
    clients[rn][ip] = ws;
    // console.log(clients);

    // Handle incoming messages
    ws.on('message', (message) => {
      // Handle the message from the client
      // console.log(`Received message from client ${rn}: ${message}`);
      // ws.send(`${JSON.stringify({data:[rn, ip, message.toString()]})}`);
      // Broadcast the message to all clients
      const account = fs.readFileSync(path.resolve(publicPath, '../data/account.json')); // private.html을 읽어옴
      const accountJson = JSON.parse(account);
      let ipList = [];
      accountJson.users.forEach((user) => {
        ipList[user.ip] = user.name;
      });
      try {
        if (clients[rn]) {
          ban = JSON.parse(fs.readFileSync(path.resolve(publicPath, '../data/ban.json'))).ban;
          Object.keys(clients[rn]).forEach((client) => {
            if (ban[ip] == undefined) {
              ban[ip] = false;
              fs.writeFileSync(path.resolve(publicPath, '../data/ban.json'), JSON.stringify({ban: ban}));
            }
            if (ban[ip] == true) {
              clients[rn][client].send(`${JSON.stringify({data:[rn, ipList[ip], 'command: shutdown']})}`);
            }
            clients[rn][client].send(`${JSON.stringify({data:[rn, ipList[ip], message.toString()]})}`);
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

    // Handle connection close
    ws.on('close', () => {
      // Remove the WebSocket connection from the stored clients
      delete clients[rn];
      console.log(`Client ${rn} disconnected`);
    });

    // Send a welcome message to the client
    ws.send(`Welcome, client ${rn}!`);
  });
}

module.exports = webSocketServer;