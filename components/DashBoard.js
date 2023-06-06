import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function DashboardPage({ route }) {
  const navigation = useNavigation();
  const { username } = route.params;
  const [userData, setUserData] = useState(null);
  const [pgLayoutData, setPGLayoutData] = useState(null);
  const [currentOccupancy, setCurrentOccupancy] = useState(0);
  const [currentMonthlyRevenue, setCurrentMonthlyRevenue] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
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

    const fetchPGLayoutData = async () => {
      try {
        const pgLayoutDataJSON = await AsyncStorage.getItem(username);
        const parsedPGLayoutData = JSON.parse(pgLayoutDataJSON);

        if (parsedPGLayoutData) {
          setPGLayoutData(parsedPGLayoutData);
          setCurrentOccupancy(parsedPGLayoutData.currentOccupancy || 0);
          setCurrentMonthlyRevenue(parsedPGLayoutData.currentMonthlyRevenue || 0);
          setTotalDue(parsedPGLayoutData.totalDue || 0);
        }
      } catch (error) {
        console.log('Error fetching PG layout data:', error);
      }
    };

    fetchUserData();
    fetchPGLayoutData();
  }, [username, pgLayoutData]);

  const handleAddPGLayout = () => {
    navigation.navigate('PGLayout', {
      username: username
    });
  };

  const handleOnboard = () => {
    const temp = currentOccupancy + 1;
    setCurrentOccupancy(temp);
    updatePGLayoutData();
  };

  const handleOffboard = () => {
    if (currentOccupancy > 0) {
      const temp = currentOccupancy - 1;
      setCurrentOccupancy(temp);
      updatePGLayoutData();
    }
  };

  const updatePGLayoutData = async () => {
    if (pgLayoutData) {
      const updatedPGLayoutData = {
        ...pgLayoutData,
        currentOccupancy: currentOccupancy,
      };
      try {
        await AsyncStorage.setItem(username, JSON.stringify(updatedPGLayoutData));
        setPGLayoutData(updatedPGLayoutData);
      } catch (error) {
        console.log('Error updating PG layout data:', error);
      }
    }
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

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoTitle}>Number of Rooms:</Text>
          <Text style={styles.infoValue}>{pgLayoutData?.numFloors * pgLayoutData?.numRoomsPerFloor || 0}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoTitle}>Max Occupancy:</Text>
          <Text style={styles.infoValue}>{pgLayoutData?.numFloors * pgLayoutData?.numRoomsPerFloor * pgLayoutData?.numBedsPerRoom || 0}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoTitle}>Max Revenue:</Text>
          <Text style={styles.infoValue}>{pgLayoutData?.numFloors * pgLayoutData?.numRoomsPerFloor * pgLayoutData?.numBedsPerRoom * pgLayoutData?.costPerBed || 0}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddPGLayout}>
          <Text style={styles.buttonText}>Add PG Layout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.extraInfoContainer}>
        <View style={styles.extraInfoItem}>
          <Text style={styles.extraInfoTitle}>Current Occupancy:</Text>
          <Text style={styles.extraInfoValue}>{currentOccupancy}</Text>
        </View>
        <View style={styles.extraInfoItem}>
          <Text style={styles.extraInfoTitle}>Current Monthly Revenue:</Text>
          <Text style={styles.extraInfoValue}>{currentMonthlyRevenue}</Text>
        </View>
        <TouchableOpacity style={styles.onboardButton} onPress={handleOnboard}>
          <Text style={styles.buttonText}>Onboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.offboardButton} onPress={handleOffboard}>
          <Text style={styles.buttonText}>Offboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.totalDueContainer}>
        <Text style={styles.totalDueTitle}>Total Due:</Text>
        <Text style={styles.totalDueValue}>{totalDue}</Text>
      </View>
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
    marginBottom: 16,
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  extraInfoContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  extraInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  extraInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  extraInfoValue: {
    fontSize: 16,
  },
  onboardButton: {
    backgroundColor: '#28a745',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  offboardButton: {
    backgroundColor: '#dc3545',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  totalDueContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 16,
  },
  totalDueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalDueValue: {
    fontSize: 16,
  },
});
