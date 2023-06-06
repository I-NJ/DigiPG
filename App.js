import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Image} from 'react-native';
import LoginPage from './components/login';
import RegistrationPage from './components/registration';
import AdditionalDetailsPage from './components/additionaldetails';
import DashboardPage from './components/DashBoard';
import PGLayout from './components/PGLayout';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Image
              source={require('./assets/icon/DigiLight.png')}
              style={styles.logo}
            />
          ),
        }}
      >
        <Stack.Screen name="DigiPG" component={LoginPage} />
        <Stack.Screen name="Registration" component={RegistrationPage} />
        <Stack.Screen name="PG Details" component={AdditionalDetailsPage}/>
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="PGLayout" component={PGLayout}/>
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});
