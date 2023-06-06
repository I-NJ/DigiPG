import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  //AsyncStorage.clear();

  const handleLogin = async () => {
    try {
      setInvalidCredentials(false);
      const existingRegistrations = await AsyncStorage.getItem('registrations');
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];

      const matchedRegistration = registrations.find(registration => registration.username === username && registration.password === password);

      if (matchedRegistration) {
        if (matchedRegistration.firstLogin) {
          navigation.navigate('PG Details', {
            username: matchedRegistration.username
          });
        } else {
          navigation.navigate('Dashboard', {
            username: matchedRegistration.username
          });
        }
      } else {
        setInvalidCredentials(true);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Registration');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.loginText}>Login</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          invalidCredentials && styles.inputError
        ]}
        placeholder="PG - ID"
        placeholderTextColor="#aaa"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={[
          styles.input,
          invalidCredentials && styles.inputError
        ]}
        placeholder="Password"
        placeholderTextColor="#aaa"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      {invalidCredentials && (
        <Text style={styles.errorText}>Invalid credentials. Please try again.</Text>
      )}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register Here</Text>
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
    marginBottom:100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  loginText: {
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
  inputError: {
    borderColor: 'red', 
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#007bff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
