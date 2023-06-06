import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardPage({ route }) {
  const { username } = route.params;
  const [userData, setUserData] = useState(null);
  const [numberOfRooms, setNumberOfRooms] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const existingRegistrations = await AsyncStorage.getItem('registrations');
        const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];

        const matchedRegistration = registrations.find(registration => registration.username === username);

        if (matchedRegistration) {
          setUserData(matchedRegistration);
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [username]);

  const handleAddPGLayout = () => {
    console.log('Add PG Layout button pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.pgDetailsContainer}>
        {userData && (
          <View>
            <Text style={styles.value}>{userData.pgName}</Text>
            <Text style={styles.value}>{userData.pgAddress}</Text>
            <Text style={styles.value}>{userData.pgOwnerName}</Text>
            <Text style={styles.value}>{userData.pgPhoneNumber}</Text>
          </View>
        )}
      </View>

      <View style={styles.roomsContainer}>
        <Text style={styles.roomsText}>Number of Rooms: {numberOfRooms}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPGLayout}>
        <Text style={styles.addButtonLabel}>Add PG Layout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  pgDetailsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  roomsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  roomsText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
