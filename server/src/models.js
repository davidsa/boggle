const CHARS = "AAABCDEEEFGHIIIJLMNOOOPQRSTUUUVYZ";

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
      const letter = randomLetter();
      board[i][j] = letter === "Q" ? "Qu" : letter;
    }
  }
  return board;
}

module.exports = { generateBoard };
