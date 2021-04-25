const { generateUserID } = require('../../util/generators');

const joinGame = (ws, event) => {
  const { username, gameID } = event.data;
  if (games[gameID]) {
    // Generate user ID, and update the global games and users variables
    const userID = generateUserID();
    const { users: gameUsers } = games[gameID];
    gameUsers.push(userID);
    games[gameID].users = gameUsers;
    users[userID] = { username, gameID };

    // Update the userData key of the actual websocket connection so that the information
    // can be tied to the client's future calls
    ws.userData = { userID, username, gameID };
    return ws.send(
      JSON.stringify({
        event: {
          type: 'joinGame',
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
  }
  // If the game doesn't exist, send error message
  return ws.send(
    JSON.stringify({
      error: 'Game with that ID does not exist'
    })
  );
};

module.exports = joinGame;
