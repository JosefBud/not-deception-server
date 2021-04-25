const { s4, generateUserID } = require('../../util/generators');

const createGame = (ws, event) => {
  // Generate game ID, user ID, and update the global games and users variables
  const { username } = event.data;
  const gameID = s4();
  const userID = generateUserID();
  games[gameID] = {
    host: userID,
    users: [userID]
  };
  users[userID] = { username, gameID };

  // Update the userData key of the actual websocket connection so that the information
  // can be tied to the client's future calls
  ws.userData = { userID, username, gameID };
  return ws.send(
    JSON.stringify({
      event: {
        type: 'createGame',
        data: {
          user: { userID, username },
          game: {
            gameID,
            ...games[gameID]
          }
        }
      }
    })
  );
};

module.exports = createGame;
