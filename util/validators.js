const eventTypes = new Set([
  'createUser',
  'createGame',
  'joinGame',
  'reconnectUser',
  'updateGame',
  'startGame',
  'playerGuess'
]);

const validateEventType = (event) => {
  return eventTypes.has(event?.type);
};

module.exports = { validateEventType };
