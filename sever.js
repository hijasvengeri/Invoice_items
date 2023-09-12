const express = require('express');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to send JSON data to connected clients
function sendJSONToClients() {
  fs.readFile('C:/Users/Hijas/Desktop/output.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonData));
      }
    });
  });
}

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('A client connected.');

  // Send JSON data to the newly connected client
  sendJSONToClients();

  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

// Set up periodic updates (e.g., every 5 seconds)
setInterval(sendJSONToClients, 5000);

server.listen(port, () => {
  console.log(`Server is listening at http://192.168.29.131:${port}`);
});