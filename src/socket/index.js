const WebSocket = require('ws');


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
      Object.keys(clients[rn]).forEach((client) => {
        clients[rn][client].send(`${JSON.stringify({data:[rn, ip, message.toString()]})}`);
      });
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