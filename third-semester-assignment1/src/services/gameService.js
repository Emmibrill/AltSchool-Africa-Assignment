const sessions = require('../data/sessionStore');


// CREATE SESSION
const createSession = (socketId, username, sessionId) => {

  const player = {
    socketId,
    username,
    score: 0,
    attemptsLeft: 3,
    isGameMaster: true
  };

  const session = {
    sessionId,
    gameMaster: socketId,
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


// JOIN SESSION
const joinSession = (
  sessionId,
  socketId,
  username
) => {

  const session = sessions.get(sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.gameActive) {
    throw new Error(
      'Game already in progress'
    );
  }

  const existingPlayer =
    session.players.find(
      player =>
        player.username === username
    );

  if (existingPlayer) {
    throw new Error(
      'Username already exists'
    );
  }

  const player = {
    socketId,
    username,
    score: 0,
    attemptsLeft: 3,
    isGameMaster: false
  };

  session.players.push(player);

  return session;
};


// SUBMIT QUESTION
const submitQuestion = (
  sessionId,
  socketId,
  question,
  answer
) => {

  const session = sessions.get(sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.gameMaster !== socketId) {
    throw new Error(
      'Only game master can submit question'
    );
  }

  session.question = question;

  session.answer =
    answer.toLowerCase().trim();

  return session;
};


// START GAME
const startGame = (sessionId, socketId, io) => {

  const session = sessions.get(sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.gameMaster !== socketId) {
    throw new Error(
      'Only game master can start game'
    );
  }

  if (session.players.length < 3) {
    throw new Error(
      'Minimum 3 players required'
    );
  }

  if (!session.question || !session.answer) {
    throw new Error(
      'Question and answer required'
    );
  }

  session.gameActive = true;

  session.winner = null;

  session.players.forEach(player => {
    player.attemptsLeft = 3;
  });

  io.to(sessionId).emit(
    'game-started',
    {
      question: session.question
    }
  );

  session.timer = setTimeout(() => {

    if (!session.winner) {

      session.gameActive = false;

      io.to(sessionId).emit(
        'timer-ended',
        {
          answer: session.answer,
          message: 'Time Up! No winner.'
        }
      );
    }

  }, Number(process.env.GAME_DURATION));

  return session;
};


// GUESS ANSWER
const guessAnswer = (
  sessionId,
  socketId,
  guess,
  io
) => {

  const session = sessions.get(sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  if (!session.gameActive) {
    throw new Error(
      'Game not active'
    );
  }

  const player = session.players.find(
    p => p.socketId === socketId
  );

  if (!player) {
    throw new Error('Player not found');
  }

  if (player.attemptsLeft <= 0) {
    throw new Error(
      'No attempts left'
    );
  }

  player.attemptsLeft--;

  if (
    guess.toLowerCase().trim() ===
    session.answer
  ) {

    session.winner = player.username;

    session.gameActive = false;

    player.score += 10;

    clearTimeout(session.timer);

    io.to(sessionId).emit(
      'player-won',
      {
        winner: player.username,
        answer: session.answer,
        scores: session.players
      }
    );

    rotateGameMaster(session);

    return;
  }

  return {
    correct: false,
    attemptsLeft: player.attemptsLeft
  };
};


// ROTATE GAME MASTER
const rotateGameMaster = (session) => {

  if (session.players.length === 0) {
    return;
  }

  session.players.forEach(player => {
    player.isGameMaster = false;
  });

  const currentIndex =
    session.players.findIndex(
      player =>
        player.socketId ===
        session.gameMaster
    );

  const nextIndex =
    (currentIndex + 1) %
    session.players.length;

  session.players[nextIndex]
    .isGameMaster = true;

  session.gameMaster =
    session.players[nextIndex].socketId;
};


// LEAVE SESSION
const leaveSession = (
  sessionId,
  socketId
) => {

  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  session.players =
    session.players.filter(
      player =>
        player.socketId !== socketId
    );

  if (session.players.length === 0) {

    clearTimeout(session.timer);

    sessions.delete(sessionId);

    return null;
  }

  return session;
};


module.exports = {
  createSession,
  joinSession,
  submitQuestion,
  startGame,
  guessAnswer,
  leaveSession
};