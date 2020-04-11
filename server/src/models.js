const CHARS = "ABCDEFGHIJLMNOPQRSTUVYZ";

function randomLetter() {
  const i = Math.floor(Math.random() * CHARS.length);
  return CHARS[i];
}

function generateBoard() {
  const board = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (j === 0) {
        board[i] = [];
      }
      board[i][j] = randomLetter();
    }
  }
  return board;
}

module.exports = { generateBoard };
