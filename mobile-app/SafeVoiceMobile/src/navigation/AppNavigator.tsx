import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AlertsScreen from '../screen/AlertsScreen';
import MonitoringScreen from '../screen/MonitoringScreen';
import LoginScreen from '../screen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen';


export type RootStackParamList = { 
    Login: undefined;
    Monitoring: undefined;
    Alerts: undefined;
    RegisterScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>(); 

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Monitoring" component={MonitoringScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}