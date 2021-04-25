const port = 8000;
const http = require('http');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const { validateEventType } = require('./util/validators');
const createGame = require('./lib/events/createGame');
const joinGame = require('./lib/events/joinGame');

global.users = {};
global.games = {};

// If production, use https / wss, otherwise use http / ws
let nodeServer;
if (process.env.NODE_ENV === 'production') {
  nodeServer = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/ws.notdeception.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/ws.notdeception.com/privkey.pem')
  });
} else {
  nodeServer = http.createServer();
}
nodeServer.listen(port, '0.0.0.0');

const server = new WebSocket.Server({ server: nodeServer });
server.on('connection', (ws) => {
  ws.userData = {};
  ws.on('message', (message) => {
    console.log('received: %s', message);
    try {
      // Validate event type
      const { event } = JSON.parse(message);
      const validatedEventType = validateEventType(event);
      if (!validatedEventType) {
        return ws.send(
          JSON.stringify({
            error: 'Invalid event type'
          })
        );
      }

      if (event.type === 'createGame') {
        return createGame(ws, event);
      }

      if (event.type === 'joinGame') {
        return joinGame(ws, event);
      }

      // for (client of server.clients) {
      //   client.send(game update event);
      // }
    } catch (error) {
      console.log(error);
      ws.send(
        JSON.stringify({
          error: 'Unknown error'
        })
      );
    }
  });

  ws.on('close', () => {
    console.log('user closed connection');
    try {
      // If a connection closes, delete user from list of users and from the games they're in
      // TODO: Handle this with cookie later on
      delete users[ws.userData?.userID];
      const gameID = ws.userData?.gameID;
      const { users: gameUsers } = games[gameID];
      games[gameID].users = gameUsers.filter((userID) => userID !== ws.userData?.userID);
      for (client of server.clients) {
        const { userData } = client;
        if (userData.gameID === gameID) {
          // client.send(game update event);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});
