const addPlayer = (session, player) => {
  session.players.push(player);
};

const removePlayer = (session, socketId) => {
  session.players = session.players.filter(
    player => player.socketId !== socketId
  );
};

const getPlayer = (session, socketId) => {
  return session.players.find(
    player => player.socketId === socketId
  );
};

module.exports = {
  addPlayer,
  removePlayer,
  getPlayer
};