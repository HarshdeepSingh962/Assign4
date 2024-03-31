import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Vibration, TextInput } from 'react-native';
import { Audio } from 'expo-av';

const TamagotchiGame = () => {
  const [happiness, setHappiness] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [cleanliness, setCleanliness] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [petImage, setPetImage] = useState(require('./assets/happypet.gif'));
  const [sound, setSound] = useState();
  const [gameOver, setGameOver] = useState(false);
  const [petName, setPetName] = useState('');
  const [points, setPoints] = useState(0);

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
    // Check if any of the bars reach 50% or 0%
    if (happiness <= 50 || hunger <= 50 || cleanliness <= 50 || energy <= 50) {
      setPetImage(require('./assets/sadpet.gif'));
    } else {
      setPetImage(require('./assets/happypet.gif'));
    }

    // Check if any of the bars reach 0%
    if (!gameOver && (happiness === 0 || hunger === 0 || cleanliness === 0 || energy === 0)) {
      setPetImage(require('./assets/angrypet.png'));
      setGameOver(true);
      playGameOverSound();
      Alert.alert(
        'Game Over',
        'Your Tamagotchi has passed away. Please restart the game.',
        [{ text: 'Restart', onPress: () => restartGame() }]
      );
      Vibration.vibrate([1000]); // Vibrate for 1 second
    }
  }, [happiness, hunger, cleanliness, energy, gameOver]);

  useEffect(() => {
    // Update bars dynamically based on state values
    const interval = setInterval(() => {
      setHappiness(prevHappiness => Math.max(prevHappiness - 2, 0));
      setHunger(prevHunger => Math.max(prevHunger - 1, 0));
      setCleanliness(prevCleanliness => Math.max(prevCleanliness - 1, 0));
      setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const treatPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 10, 100));
    if (sound) {
      sound.replayAsync();
    }
    setPoints(prevPoints => prevPoints + 5); // Add points for treating the pet
  };

  const feedPet = () => {
    setHunger(prevHunger => Math.min(prevHunger + 5, 100));
    if (sound) {
      sound.replayAsync();
    }
    setPoints(prevPoints => prevPoints + 3); // Add points for feeding the pet
  };

  const cleanPet = () => {
    setCleanliness(prevCleanliness => Math.min(prevCleanliness + 10, 100));
    if (sound) {
      sound.replayAsync();
    }
    setPoints(prevPoints => prevPoints + 2); // Add points for cleaning the pet
  };

  const restPet = () => {
    setEnergy(prevEnergy => Math.min(prevEnergy + 5, 100));
    if (sound) {
      sound.replayAsync();
    }
    setPoints(prevPoints => prevPoints + 4); // Add points for resting the pet
  };

  const tapPet = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 20, 100));
    if (sound) {
      sound.replayAsync();
    }
    setPoints(prevPoints => prevPoints + 10); // Add points for tapping the pet
  };

  const restartGame = () => {
    setHappiness(100);
    setHunger(100);
    setCleanliness(100);
    setEnergy(100);
    setPetImage(require('./assets/happypet.gif'));
    setGameOver(false);
    setPoints(0); // Reset points when restarting the game
  };

  const playGameOverSound = async () => {
    const { sound: gameOverSound } = await Audio.Sound.createAsync(
      require('./assets/deadsound.mp3')
    );
    gameOverSound.replayAsync();
  };

  const handleAddPet = () => {
    // Implement logic to add the user's pet
    if (petName.trim() !== '') {
      Alert.alert('Pet Added', `Your pet ${petName} has been added!`);
    } else {
      Alert.alert('Error', 'Please enter a name for your pet.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={tapPet}>
        <View style={styles.petContainer}>
          <Image source={petImage} style={styles.petImage} />
          <Text style={styles.statText}>Happiness</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: happiness + '%' }]}></View>
          </View>
          <Text style={styles.statText}>Hunger</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: hunger + '%' }]}></View>
          </View>
          <Text style={styles.statText}>Cleanliness</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: cleanliness + '%' }]}></View>
          </View>
          <Text style={styles.statText}>Energy</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: energy + '%' }]}></View>
          </View>
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
      <View style={styles.addPetContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter pet name"
          onChangeText={text => setPetName(text)}
          value={petName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
          <Text style={styles.buttonText}>Add Pet Name</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.pointsText}>Points: {points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#808080'
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
  statBarContainer: {
    backgroundColor: '#ccc',
    width: 200,
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statBar: {
    backgroundColor: 'green',
    height: '100%',
    borderRadius: 5,
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
  addPetContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  pointsText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TamagotchiGame;
