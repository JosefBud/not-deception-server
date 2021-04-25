const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
    .toUpperCase();
};

// This code generates a unique UID for every user.
// If two active users end up with the same UID, they should play the lottery too
const generateUserID = () => {
  return s4() + s4() + '-' + s4();
};

module.exports = { s4, generateUserID };
