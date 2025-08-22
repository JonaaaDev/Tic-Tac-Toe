import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { calculateWinner } from './utils';

const initialBoard = Array(9).fill(null);

export const GameHistoryContext = createContext();

export default function GameScreen({ mode, difficulty }) {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current; // Para animación de escala
  const botThinkingAnim = useRef(new Animated.Value(0)).current; // Para retroalimentación del bot
  const { addGameResult } = useContext(GameHistoryContext);

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    setWinner(currentWinner);
    if (currentWinner) {
      addGameResult(currentWinner === 'X' ? 'win' : 'loss');
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (board.every(Boolean)) {
      addGameResult('draw');
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [board, scaleAnim, addGameResult]);

  useEffect(() => {
    if (mode === 'vs_ia' && !isXNext && !winner) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(botThinkingAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(botThinkingAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const aiMove = getAIMove(board, difficulty);
      if (aiMove !== null) {
        setTimeout(() => {
          Animated.timing(botThinkingAnim, { toValue: 0, duration: 0, useNativeDriver: true }).stop();
          handleClick(aiMove);
        }, 1000);
      }
    } else {
      botThinkingAnim.stop();
      botThinkingAnim.setValue(0);
    }
  }, [board, isXNext, winner, mode, difficulty, botThinkingAnim]);

  const handleClick = (index) => {
    if (board[index] || winner) {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderSquare = (index) => {
    const isBotThinking = mode === 'vs_ia' && !isXNext && !winner;
    const squareStyle = isBotThinking && board[index] === null
      ? [styles.square, { opacity: botThinkingAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.5]
        }) }]
      : styles.square;

    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={squareStyle} onPress={() => handleClick(index)} disabled={isBotThinking}>
          <Text style={styles.squareText}>{board[index]}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXNext(true);
    setWinner(null);
    scaleAnim.setValue(1); // Resetear animación de escala
    botThinkingAnim.setValue(0); // Resetear animación del bot
  };

  let status;
  if (winner) {
    status = 'Ganador: ' + winner;
  } else if (board.every(Boolean)) {
    status = 'Empate!';
  } else {
    status = 'Siguiente jugador: ' + (isXNext ? 'X' : 'O');
  }

  const botStatusStyle = mode === 'vs_ia' && !isXNext && !winner
    ? { opacity: botThinkingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5]
      }) }
    : {};

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.status, botStatusStyle]}>{status}</Animated.Text>
      <View style={styles.board}>
        <View style={styles.boardRow}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.boardRow}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.boardRow}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reiniciar Juego</Text>
      </TouchableOpacity>
      <GameHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  status: {
    fontSize: 25,
    marginBottom: 20,
    color: '#61dafb',
  },
  board: {
    borderWidth: 5,
    borderColor: '#61dafb',
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#61dafb',
  },
  squareText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#61dafb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    fontSize: 20,
    color: '#282c34',
    fontWeight: 'bold',
  },
  historyContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: 10,
  },
  historyText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

function GameHistory() {
  const { history } = useContext(GameHistoryContext);

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Historial de Partidas:</Text>
      <Text style={styles.historyText}>Victorias: {history.wins}</Text>
      <Text style={styles.historyText}>Derrotas: {history.losses}</Text>
      <Text style={styles.historyText}>Empates: {history.draws}</Text>
    </View>
  );
}
