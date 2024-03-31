import React from 'react';
import { View, StyleSheet } from 'react-native';
import TamagotchiGame from './TamagotchiGame';

const App = () => {
  return (
    <View style={styles.container}>
      <TamagotchiGame />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#808080', // Change background color to match TamagotchiGame
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
