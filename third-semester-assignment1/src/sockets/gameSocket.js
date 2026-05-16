const {
  v4: uuidv4
} = require('uuid');

const {
  createSession,
  joinSession,
  submitQuestion,
  startGame,
  guessAnswer,
  leaveSession
} = require('../services/gameService');


module.exports = (io) => {

  io.on('connection', (socket) => {

    console.log(
      `User connected: ${socket.id}`
    );


    // CREATE SESSION
    socket.on(
      'create-session',
      ({ username }) => {

        try {

          const sessionId =
            uuidv4().split('-')[0];

          const session =
            createSession(
              socket.id,
              username,
              sessionId
            );

          socket.join(sessionId);

          socket.emit(
            'session-created',
            session
          );

        } catch (error) {

          socket.emit(
            'error-message',
            error.message
          );
        }
      }
    );


    // JOIN SESSION
    socket.on(
      'join-session',
      ({ sessionId, username }) => {

        try {

          const session =
            joinSession(
              sessionId,
              socket.id,
              username
            );

          socket.join(sessionId);

          io.to(sessionId).emit(
            'player-joined',
            {
              players: session.players,
              playerCount:
                session.players.length
            }
          );

        } catch (error) {

          socket.emit(
            'error-message',
            error.message
          );
        }
      }
    );


    // SUBMIT QUESTION
    socket.on(
      'submit-question',
      ({
        sessionId,
        question,
        answer
      }) => {

        try {

          submitQuestion(
            sessionId,
            socket.id,
            question,
            answer
          );

          io.to(sessionId).emit(
            'question-submitted',
            {
              message:
                'Question submitted successfully'
            }
          );

        } catch (error) {

          socket.emit(
            'error-message',
            error.message
          );
        }
      }
    );


    // START GAME
    socket.on(
      'start-game',
      ({ sessionId }) => {

        try {

          startGame(
            sessionId,
            socket.id,
            io
          );

        } catch (error) {

          socket.emit(
            'error-message',
            error.message
          );
        }
      }
    );


    // GUESS ANSWER
    socket.on(
      'guess-answer',
      ({
        sessionId,
        guess
      }) => {

        try {

          const result =
            guessAnswer(
              sessionId,
              socket.id,
              guess,
              io
            );

          if (result?.correct === false) {

            socket.emit(
              'wrong-answer',
              result
            );
          }

        } catch (error) {

          socket.emit(
            'error-message',
            error.message
          );
        }
      }
    );


    // LEAVE SESSION
    socket.on(
      'leave-session',
      ({ sessionId }) => {

        try {

          const session =
            leaveSession(
              sessionId,
              socket.id
            );

          socket.leave(sessionId);

          if (session) {

            io.to(sessionId).emit(
              'player-left',
              {
                players:
                  session.players,
                playerCount:
                  session.players.length
              }
            );
          }

        } catch (error) {

          socket.emit(
            'error-message',
            error.message
          );
        }
      }
    );


    // DISCONNECT
    socket.on('disconnect', () => {

      console.log(
        `Disconnected: ${socket.id}`
      );

      // FIND SESSION PLAYER BELONGS TO
  const sessions =
    require('../data/sessionStore');

  sessions.forEach(
    (session, sessionId) => {

      const playerExists =
        session.players.find(
          player =>
            player.socketId === socket.id
        );

      if (playerExists) {

        const updatedSession =
          leaveSession(
            sessionId,
            socket.id
          );

        if (updatedSession) {

          io.to(sessionId).emit(
            'player-left',
            {
              players:
                updatedSession.players,

              playerCount:
                updatedSession.players.length
            }
          );
        }
      }
    }
  );

    });

  });

};