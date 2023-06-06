import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PGLayout({ route }) {
  const { username } = route.params;
  const navigation = useNavigation();
  const [numFloors, setNumFloors] = useState('');
  const [numRoomsPerFloor, setNumRoomsPerFloor] = useState('');
  const [numBedsPerRoom, setNumBedsPerRoom] = useState('');
  const [costPerBed, setCostPerBed] = useState('');

  const handleSavePGLayout = async () => {
    // Validate input
    if (!numFloors || !numRoomsPerFloor || !numBedsPerRoom || !costPerBed) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Get existing PG layout data for the user
      const existingPGLayoutDataJSON = await AsyncStorage.getItem(username);
      const existingPGLayoutData = existingPGLayoutDataJSON ? JSON.parse(existingPGLayoutDataJSON) : {};

      // Update PG layout data with the new values
      const updatedPGLayoutData = {
        ...existingPGLayoutData,
        numFloors: parseInt(numFloors),
        numRoomsPerFloor: parseInt(numRoomsPerFloor),
        numBedsPerRoom: parseInt(numBedsPerRoom),
        costPerBed: parseFloat(costPerBed),
      };

      // Store the updated PG layout data in AsyncStorage
      await AsyncStorage.setItem(username, JSON.stringify(updatedPGLayoutData));

      // Navigate back to the Dashboard
      navigation.navigate('Dashboard', {
        username: username,
      });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving PG layout data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PG Layout</Text>
      <TextInput
        style={styles.input}
        placeholder="Number of Floors"
        placeholderTextColor="#aaa"
        onChangeText={text => setNumFloors(text)}
        value={numFloors}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Rooms per Floor"
        placeholderTextColor="#aaa"
        onChangeText={text => setNumRoomsPerFloor(text)}
        value={numRoomsPerFloor}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Beds per Room"
        placeholderTextColor="#aaa"
        onChangeText={text => setNumBedsPerRoom(text)}
        value={numBedsPerRoom}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cost per Bed"
        placeholderTextColor="#aaa"
        onChangeText={text => setCostPerBed(text)}
        value={costPerBed}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePGLayout}>
        <Text style={styles.saveButtonText}>Save PG Layout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
