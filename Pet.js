import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av';
import { Haptic } from 'expo';

const DigipetApp = () => {
  const [happiness, setHappiness] = useState(100);

  useEffect(() => {
    // Decrease happiness over time
    const interval = setInterval(() => {
      setHappiness(prevHappiness => Math.max(prevHappiness - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const treatPet = async () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 10, 100));
    // Play a sound
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./assets/treat_sound.mp3'));
      soundObject.playAsync();
    } catch (error) {
      console.error('Failed to load sound', error);
    }
  };

  const petPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 5, 100));
    // Trigger haptic feedback
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  };

  // Determine which image to display based on happiness level
  const petImage = happiness > 50 ? require('./assets/happy_pet.png') : require('./assets/sad_pet.png');

  return (
    <View style={styles.container}>
      <View style={styles.petContainer}>
        <Image source={petImage} style={styles.petImage} />
        <Text style={styles.happinessText}>Happiness: {happiness}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={treatPet}>
          <Text style={styles.buttonText}>Treat</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={petPet}>
          <Text style={styles.buttonText}>Pet</Text>
        </Pressable>
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
  happinessText: {
    fontSize: 20,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
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

export default DigipetApp;
