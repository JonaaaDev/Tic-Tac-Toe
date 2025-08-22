import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ onSelectMode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona el Modo de Juego</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSelectMode('local')}
      >
        <Text style={styles.buttonText}>Modo Local (2 Jugadores)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSelectMode('vs_ia')}
      >
        <Text style={styles.buttonText}>Modo vs IA</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#61dafb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#282c34',
    fontWeight: 'bold',
  },
});
