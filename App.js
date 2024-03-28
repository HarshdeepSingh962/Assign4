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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
