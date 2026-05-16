const socket = io();

let currentSessionId = '';
let currentUsername = '';
let isGameMaster = false;


// INPUTS
const createUsernameInput =
  document.getElementById(
    'create-username'
  );

const joinUsernameInput =
  document.getElementById(
    'join-username'
  );

const sessionInput =
  document.getElementById(
    'session-id'
  );


// UI ELEMENTS
const messages =
  document.getElementById('messages');

const questionBox =
  document.getElementById('question-box');

const playersList =
  document.getElementById('players-list');

const scoresList =
  document.getElementById('scores-list');

const playerCount =
  document.getElementById('player-count');

const attempts =
  document.getElementById('attempts');


// CREATE SESSION
document
  .getElementById('create-btn')
  .addEventListener('click', () => {

    currentUsername =
      createUsernameInput.value;

    socket.emit('create-session', {
      username: currentUsername
    });

  });


// JOIN SESSION
document
  .getElementById('join-btn')
  .addEventListener('click', () => {

    currentUsername =
      joinUsernameInput.value;

    currentSessionId =
      sessionInput.value;

    socket.emit('join-session', {
      sessionId: currentSessionId,
      username: currentUsername
    });

  });


// LEAVE SESSION
document
  .getElementById('leave-btn')
  .addEventListener('click', () => {

    if (!currentSessionId) return;

    socket.emit('leave-session', {
      sessionId: currentSessionId
    });

    addMessage('You left the session');

    currentSessionId = '';
     isGameMaster = false;
     document.getElementById('master-controls').classList.add('hidden');

    document.getElementById(
      'current-session'
    ).innerText = 'None';

    playersList.innerHTML = '';
    scoresList.innerHTML = '';

  });


// SUBMIT QUESTION
document
  .getElementById(
    'submit-question-btn'
  )
  .addEventListener('click', () => {

    const question =
      document.getElementById(
        'question-input'
      ).value;

    const answer =
      document.getElementById(
        'answer-input'
      ).value;

    socket.emit('submit-question', {
      sessionId: currentSessionId,
      question,
      answer
    });

  });


// START GAME
document
  .getElementById(
    'start-game-btn'
  )
  .addEventListener('click', () => {

    socket.emit('start-game', {
      sessionId: currentSessionId
    });

  });


// GUESS ANSWER
document
  .getElementById('guess-btn')
  .addEventListener('click', () => {

    const guess =
      document.getElementById(
        'guess-input'
      ).value;

    socket.emit('guess-answer', {
      sessionId: currentSessionId,
      guess
    });

  });


// SESSION CREATED
socket.on(
  'session-created',
  (session) => {

    currentSessionId =
      session.sessionId;

    isGameMaster = true;

    document.getElementById(
      'current-session'
    ).innerText =
      session.sessionId;

    // SHOW MASTER CONTROLS
    document
      .getElementById(
        'master-controls'
      )
      .classList.remove('hidden');

    updatePlayers(session.players);

    addMessage(
      `Session created successfully`
    );

    addMessage(
      `Share Session ID: ${session.sessionId}`
    );
  }
);


// PLAYER JOINED
socket.on(
  'player-joined',
  (data) => {

    isGameMaster = false;

    // HIDE MASTER CONTROLS
    document
      .getElementById(
        'master-controls'
      )
      .classList.add('hidden');

    updatePlayers(data.players);

    addMessage(
      `Player joined. Total players: ${data.playerCount}`
    );
  }
);


// PLAYER LEFT
socket.on(
  'player-left',
  (data) => {

    updatePlayers(data.players);

    addMessage(
      'A player left the session'
    );
  }
);


// QUESTION SUBMITTED
socket.on(
  'question-submitted',
  (data) => {

    addMessage(data.message);
  }
);


// GAME STARTED
socket.on(
  'game-started',
  (data) => {

    questionBox.innerText =
      data.question;

    addMessage(
      'Game Started!'
    );
  }
);


// WRONG ANSWER
socket.on(
  'wrong-answer',
  (data) => {

    attempts.innerText =
      data.attemptsLeft;

    addMessage(
      `Wrong answer. Attempts left: ${data.attemptsLeft}`
    );
  }
);


// PLAYER WON
socket.on(
  'player-won',
  (data) => {

    addMessage(
      `${data.winner} won!`
    );

    addMessage(
      `Correct Answer: ${data.answer}`
    );

    updateScores(data.scores);
  }
);


// TIMER ENDED
socket.on(
  'timer-ended',
  (data) => {

    addMessage(
      `Time Up!`
    );

    addMessage(
      `Correct Answer: ${data.answer}`
    );
  }
);


// ERROR
socket.on(
  'error-message',
  (message) => {

    addMessage(
      `Error: ${message}`
    );
  }
);


// UPDATE PLAYERS
function updatePlayers(players) {

  playersList.innerHTML = '';

  scoresList.innerHTML = '';

  playerCount.innerText =
    `Players: ${players.length}`;

  players.forEach(player => {

    const li =
      document.createElement('li');

    li.innerText =
      player.username;

    playersList.appendChild(li);

    const scoreLi =
      document.createElement('li');

    scoreLi.innerText =
      `${player.username}: ${player.score}`;

    scoresList.appendChild(scoreLi);

  });
}


// UPDATE SCORES
function updateScores(players) {

  scoresList.innerHTML = '';

  players.forEach(player => {

    const li =
      document.createElement('li');

    li.innerText =
      `${player.username}: ${player.score}`;

    scoresList.appendChild(li);

  });
}


// ADD MESSAGE
function addMessage(message) {

  const div =
    document.createElement('div');

  div.classList.add('message');

  div.innerText = message;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;
}