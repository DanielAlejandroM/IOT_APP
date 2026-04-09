import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDrawerContent from "./CustomDrawerContent";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import MonitoringScreen from "../screen/MonitoringScreen";
import AlertsScreen from "../screen/AlertsScreen";
import AlertDetailScreen from "../screen/AlertDetailScreen";
import AlertHistoryScreen from "../screen/AlertHistoryScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("access_token");

      if (token) {
        setInitialRoute("Monitoring");
      } else {
        setInitialRoute("Login");
      }
    };

    checkToken();
  }, []);

  if (!initialRoute) return null;

  function DrawerNavigator() {

    return (
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Monitoring" component={MonitoringScreen} />
        <Drawer.Screen name="Alerts" component={AlertsScreen} />
        <Drawer.Screen name="AlertDetail" component={AlertDetailScreen} />
        <Drawer.Screen name="AlertHistory" component={AlertHistoryScreen} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}