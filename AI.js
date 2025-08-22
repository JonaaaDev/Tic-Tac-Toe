// AI.js

export const getAIMove = (board, difficulty) => {
  switch (difficulty) {
    case 'easy':
      return getRandomMove(board);
    case 'medium':
      return getMediumMove(board);
    case 'hard':
      return getMinimaxMove(board);
    default:
      return getRandomMove(board);
  }
};

const getRandomMove = (board) => {
  const emptySquares = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
};

const getMediumMove = (board) => {
  // Try to win
  let move = findWinningMove(board, 'O');
  if (move !== null) return move;

  // Block opponent's winning move
  move = findWinningMove(board, 'X');
  if (move !== null) return move;

  // Take center if available
  if (board[4] === null) return 4;

  // Take a corner if available
  const corners = [0, 2, 6, 8];
  for (let i = 0; i < corners.length; i++) {
    if (board[corners[i]] === null) return corners[i];
  }

  // Take any available side
  return getRandomMove(board);
};

const findWinningMove = (board, player) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const line = [board[a], board[b], board[c]];
    const emptyIndex = line.indexOf(null);

    if (emptyIndex !== -1) {
      const tempLine = [...line];
      tempLine[emptyIndex] = player;
      if (tempLine[0] === player && tempLine[1] === player && tempLine[2] === player) {
        return lines[i][emptyIndex];
      }
    }
  }
  return null;
};

const getMinimaxMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = 'O'; // AI's move
      let score = minimax(board, 0, false);
      board[i] = null; // Undo move
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

const minimax = (board, depth, isMaximizingPlayer) => {
  const winner = calculateWinner(board);

  if (winner === 'X') return -10 + depth;
  if (winner === 'O') return 10 - depth;
  if (board.every(Boolean)) return 0;

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

import { calculateWinner } from './utils';
