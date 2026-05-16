const sessions = require('../data/sessionStore');
const generateSessionId = require('../utils/generateSessionId');

const createSession = (player) => {
  const sessionId = generateSessionId();

  const session = {
    sessionId,
    gameMaster: player.socketId,
    players: [player],
    question: '',
    answer: '',
    gameActive: false,
    timer: null,
    winner: null
  };

  sessions.set(sessionId, session);

  return session;
};

const getSession = (sessionId) => {
  return sessions.get(sessionId);
};

const deleteSession = (sessionId) => {
  sessions.delete(sessionId);
};

module.exports = {
  createSession,
  getSession,
  deleteSession
};