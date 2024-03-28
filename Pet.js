import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Vibration, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Haptic } from 'expo';

const TamagotchiGame = () => {
  const [happiness, setHappiness] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [cleanliness, setCleanliness] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [sound, setSound] = useState();

  useEffect(() => {
    // Load sound for treating the pet
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/treatsound.mp3')
      );
      setSound(sound);
    };
    loadSound();

    // Unload sound when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // Decrease stats over time
    const interval = setInterval(() => {
      setHappiness(prevHappiness => Math.max(prevHappiness - 2, 0));
      setHunger(prevHunger => Math.max(prevHunger - 1, 0));
      setCleanliness(prevCleanliness => Math.max(prevCleanliness - 1, 0));
      setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const treatPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 10, 100));
    setSound(sound => sound.replayAsync());
  };

  const feedPet = () => {
    setHunger(prevHunger => Math.min(prevHunger + 10, 100));
    setSound(sound => sound.replayAsync());
  };

  const cleanPet = () => {
    setCleanliness(prevCleanliness => Math.min(prevCleanliness + 10, 100));
    setSound(sound => sound.replayAsync());
  };

  const restPet = () => {
    setEnergy(prevEnergy => Math.min(prevEnergy + 10, 100));
    setSound(sound => sound.replayAsync());
  };

  const tapPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 20, 100));
    setSound(sound => sound.replayAsync());
  };

  useEffect(() => {
    // Check if Tamagotchi's stats are too low
    if (happiness === 0 || hunger === 0 || cleanliness === 0 || energy === 0) {
      // Play dead sound
      (async () => {
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/deadsound.mp3')
        );
        await sound.playAsync();
        Alert.alert('Game Over', 'Your Tamagotchi has passed away. Please start a new game.');
      })();
    }
  }, [happiness, hunger, cleanliness, energy]);

  // Determine which image to display based on happiness level
  let petImage = require('./assets/happypet.gif');
  if (happiness <= 60 && happiness > 20) {
    petImage = require('./assets/angrypet.png');
  } else if (happiness <= 20 && happiness > 0) {
    petImage = require('./assets/sadpet.gif');
  } else if (happiness === 0) {
    petImage = require('./assets/sadpet.gif');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={tapPet}>
        <View style={styles.petContainer}>
          <Image source={petImage} style={styles.petImage} />
          <Text style={styles.statText}>Happiness: {happiness}</Text>
          <Text style={styles.statText}>Hunger: {hunger}</Text>
          <Text style={styles.statText}>Cleanliness: {cleanliness}</Text>
          <Text style={styles.statText}>Energy: {energy}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={treatPet}>
          <Text style={styles.buttonText}>Treat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={feedPet}>
          <Text style={styles.buttonText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={cleanPet}>
          <Text style={styles.buttonText}>Clean</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={restPet}>
          <Text style={styles.buttonText}>Rest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petImage: {
    width: 150,
    height: 150,
  },
  statText: {
    fontSize: 20,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TamagotchiGame;
