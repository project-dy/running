const WebSocket = require('ws');


function webSocketServer( server ) {
  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });
  
  // Store connected clients
  const clients = {};
  // Handle incoming connections
  wss.on('connection', (ws, req) => {
    // Get the "rn" parameter from the request URL
    const urlParams = new URLSearchParams(req.url);
    const rn = urlParams.get('rn');

    // Store the WebSocket connection based on the "rn" parameter
    clients[rn] = ws;
    console.log(clients);

    // Handle incoming messages
    ws.on('message', (message) => {
      // Handle the message from the client
      console.log(`Received message from client ${rn}: ${message}`);
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