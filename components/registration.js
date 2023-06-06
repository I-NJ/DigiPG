import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [lastAddedUsername, setLastAddedUsername] = useState('');
  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate('DigiPG');
  };

  useEffect(() => {
    generateUsername();
  }, []);

  const generateUsername = async () => {
    try {
      const existingRegistrations = await AsyncStorage.getItem('registrations');
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];

      const count = registrations.length;
      const generatedUsername = `PG-${(count + 1).toString().padStart(3, '0')}`;
      setUsername(generatedUsername);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while generating username');
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setPasswordValid(false);
      return;
    }

    try {
      const existingRegistrations = await AsyncStorage.getItem('registrations');
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];

      const usernameExists = registrations.some(registration => registration.username === username);

      if (usernameExists) {
        setUsernameExists(true);
        return;
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while checking the username');
      return;
    }

    const registrationData = {
      username,
      password,
      firstLogin: true
    };

    try {
      const existingRegistrations = await AsyncStorage.getItem('registrations');
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];

      registrations.push(registrationData);

      await AsyncStorage.setItem('registrations', JSON.stringify(registrations));

      setLastAddedUsername(username);
      setRegistrationSuccess(true);
      generateUsername();
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.registerText}>Register</Text>
      </View>
      {registrationSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{lastAddedUsername} - Registration successful</Text>
        </View>
      )}
      {!passwordValid && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Password too short</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="PG - ID"
        placeholderTextColor="#aaa"
        onChangeText={text => {
          setUsername(text);
          setUsernameExists(false);
        }}
        value={username}
        readOnly
      />
      {usernameExists && (
        <Text style={styles.errorText}>Username already exists</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
        <Text style={styles.loginButtonText}>Go to Login</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  registerText: {
    fontSize: 24,
    fontWeight: 'bold',
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
  registerButton: {
    backgroundColor: '#007bff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});
