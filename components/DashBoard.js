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
  const [totalPayment, setTotalPayment] = useState(0);

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

    fetchUserData();
  }, [username]);

  useEffect(() => {
    fetchPGLayoutData();
  }, [pgLayoutData]);

  const fetchPGLayoutData = async () => {
    try {
      const pgLayoutDataJSON = await AsyncStorage.getItem(username);
      const parsedPGLayoutData = JSON.parse(pgLayoutDataJSON);

      if (parsedPGLayoutData) {
        setPGLayoutData(parsedPGLayoutData);
      }
    } catch (error) {
      console.log('Error fetching PG layout data:', error);
    }
  };

  const fetchCurrentOccupancyData = async () => {
    try {
      const currentOccupancyDataJSON = await AsyncStorage.getItem(`${username}data`);
      let parsedCurrentOccupancyData = JSON.parse(currentOccupancyDataJSON);

      if (!parsedCurrentOccupancyData) {
        parsedCurrentOccupancyData = { currentOccupancy: 0 };
        await AsyncStorage.setItem(`${username}data`, JSON.stringify(parsedCurrentOccupancyData));
      }

      setCurrentOccupancy(parsedCurrentOccupancyData.currentOccupancy || 0);
    } catch (error) {
      console.log('Error fetching current occupancy data:', error);
    }
  };

  useEffect(() => {
    fetchCurrentOccupancyData();
  }, []);

  const handleOnboard = () => {
    const updatedOccupancy = currentOccupancy + 1;
    const maxOccupancy = pgLayoutData?.numFloors * pgLayoutData?.numRoomsPerFloor * pgLayoutData?.numBedsPerRoom || 0;
    if(updatedOccupancy<=maxOccupancy)
    {
      setCurrentOccupancy(updatedOccupancy);

      const occupancyData = { currentOccupancy: updatedOccupancy };
      AsyncStorage.setItem(`${username}data`, JSON.stringify(occupancyData))
        .then(() => {
          console.log('Current occupancy updated successfully.');
        })
        .catch((error) => {
          console.log('Error updating current occupancy:', error);
        });
    }
  };

  const handleOffboard = () => {
    if (currentOccupancy > 0) {
      const updatedOccupancy = currentOccupancy - 1;
      setCurrentOccupancy(updatedOccupancy);

      const occupancyData = { currentOccupancy: updatedOccupancy };
      AsyncStorage.setItem(`${username}data`, JSON.stringify(occupancyData))
        .then(() => {
          console.log('Current occupancy updated successfully.');
        })
        .catch((error) => {
          console.log('Error updating current occupancy:', error);
        });
    }
  };

  const handleAddPGLayout = () => {
    navigation.navigate('PGLayout', {
      username: username,
      updateData: updateDataOnReturn
    });
  };

  const updateDataOnReturn = () => {
    fetchPGLayoutData();
    fetchCurrentOccupancyData();
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
          <Text style={styles.extraInfoValue}>{pgLayoutData?.costPerBed*currentOccupancy}</Text>
        </View>
        <TouchableOpacity style={styles.onboardButton} onPress={handleOnboard}>
          <Text style={styles.buttonText}>Onboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.offboardButton} onPress={handleOffboard}>
          <Text style={styles.buttonText}>Offboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.totalPaymentContainer}>
        <Text style={styles.totalPaymentTitle}>Total Payment:</Text>
        <Text style={styles.totalPaymentValue}>{totalPayment}</Text>
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
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
  },
  button: {
    marginTop: 16,
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
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
    fontWeight: 'bold',
  },
  extraInfoValue: {
    flex: 1,
    textAlign: 'right',
  },
  onboardButton: {
    marginTop: 16,
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 8,
  },
  offboardButton: {
    marginTop: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 8,
  },
  totalPaymentContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 16,
  },
  totalPaymentTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalPaymentValue: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
