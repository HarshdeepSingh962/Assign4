import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { Haptic } from 'expo';

const DigipetApp = () => {
  const [happiness, setHappiness] = useState(100);
  const [points, setPoints] = useState(0);
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

  const treatPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 10, 100));
    setPoints(prevPoints => prevPoints + 5);
    // Play a sound
    sound.replayAsync();
  };

  const petPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 5, 100));
    setPoints(prevPoints => prevPoints + 2);
    // Trigger haptic feedback
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  };

  const onSwipe = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 15, 100));
    setPoints(prevPoints => prevPoints + 10);
    Vibration.vibrate();
  };

  const onPat = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 10, 100));
    setPoints(prevPoints => prevPoints + 5);
    Vibration.vibrate([100, 200, 100]);
  };

  const onWalk = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 20, 100));
    setPoints(prevPoints => prevPoints + 15);
    Vibration.vibrate([200, 100, 200]);
  };

  useEffect(() => {
    if (happiness === 0) {
      // Play dead sound
      (async () => {
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/deadsound.mp3')
        );
        await sound.playAsync();
      })();
    }
  }, [happiness]);

  // Determine which image to display based on happiness level
  let petImage = require('./assets/happypet.gif');
  if (happiness <= 50 && happiness > 0) {
    petImage = require('./assets/angrypet.png');
  } else if (happiness === 0) {
    petImage = require('./assets/sadpet.gif');
  }

  return (
    <View style={styles.container}>
      <View style={styles.petContainer}>
        <Image source={petImage} style={styles.petImage} />
        <Text style={styles.happinessText}>Happiness: {happiness}</Text>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={treatPet}>
          <Text style={styles.buttonText}>Treat</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={petPet}>
          <Text style={styles.buttonText}>Pet</Text>
        </Pressable>
        <View style={styles.bottomButtonContainer}>
          <Pressable style={[styles.button, styles.bottomButton]} onPress={onSwipe}>
            <Text style={styles.buttonText}>Swipe</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.bottomButton]} onPress={onPat}>
            <Text style={styles.buttonText}>Pat</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.bottomButton]} onPress={onWalk}>
            <Text style={styles.buttonText}>Walk</Text>
          </Pressable>
        </View>
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
  pointsText: {
    fontSize: 20,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  bottomButton: {
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DigipetApp;
