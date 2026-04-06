import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDrawerContent(props: any) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    const nombre = await AsyncStorage.getItem("user_name");
    if (nombre) setUserName(nombre);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    props.navigation.replace("Login");
  };

  return (
    <DrawerContentScrollView {...props}>

      {/* Nombre usuario */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {userName || "Usuario"}
        </Text>
      </View>
      
      {/* Monitoreo */}
      <TouchableOpacity
        style={{ padding: 20 }}
        onPress={() => props.navigation.navigate("Monitoring")}
      >
        <Text>Monitoreo</Text>
      </TouchableOpacity>

      
      {/* Alertas cercanas */}
      <TouchableOpacity
        style={{ padding: 20 }}
        onPress={() => props.navigation.navigate("Alerts")}
      >
        <Text>Alertas cercanas</Text>
      </TouchableOpacity>

      {/* Historial */}
      <TouchableOpacity
        style={{ padding: 20 }}
        onPress={() => props.navigation.navigate("AlertDetail")}
      >
        <Text>Historial de alertas</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={{ padding: 20, marginTop: 550 }}
        onPress={logout}
      >
        <Text style={{ color: "red", fontWeight: "600" }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

    </DrawerContentScrollView>
  );
}