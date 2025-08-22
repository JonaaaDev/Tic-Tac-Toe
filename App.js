import React, { useEffect, useRef, useState, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated } from 'react-native';
import GameScreen from './GameScreen';
import HomeScreen from './HomeScreen';

export const GameHistoryContext = createContext();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [gameMode, setGameMode] = useState(null); // 'local' o 'vs_ia'
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      })
    ).start();

    setTimeout(() => {
      setShowSplash(false);
    }, 6000); // Muestra la pantalla de inicio por 6 segundos
  }, [colorAnim]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'], // Colores del arcoíris
  });

  const handleSelectGameMode = (mode, selectedDifficulty = null) => {
    setGameMode(mode);
    setDifficulty(selectedDifficulty);
  };

  const [history, setHistory] = useState({ wins: 0, losses: 0, draws: 0 });

  const addGameResult = (result) => {
    setHistory((prevHistory) => {
      if (result === 'win') {
        return { ...prevHistory, wins: prevHistory.wins + 1 };
      } else if (result === 'loss') {
        return { ...prevHistory, losses: prevHistory.losses + 1 };
      } else if (result === 'draw') {
        return { ...prevHistory, draws: prevHistory.draws + 1 };
      }
      return prevHistory;
    });
  };

  return (
    <GameHistoryContext.Provider value={{ history, addGameResult }}>
      {showSplash ? (
        <Animated.View style={[styles.container, { backgroundColor }]}>
          <Text style={styles.text}>JonathanGIZ</Text>
          <StatusBar style="auto" />
        </Animated.View>
      ) : !gameMode ? (
        <HomeScreen onSelectGameMode={handleSelectGameMode} />
      ) : (
        <GameScreen mode={gameMode} difficulty={difficulty} />
      )}
    </GameHistoryContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
