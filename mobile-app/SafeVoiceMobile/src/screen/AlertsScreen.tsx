import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert
} from "react-native";

import Geolocation from "react-native-geolocation-service";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getNearbyAlerts,
  respondToAlert
} from "../services/authServices";

import { colors, spacing, typography } from "../theme";

const logo = require("../assets/safevoice_logo.png");

export default function AlertsScreen({ navigation }: any) {

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  const requestLocationPermission = async () => {

    if (Platform.OS === "android") {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;

  };


  const loadNearbyAlerts = async () => {

    console.log("Calling nearby alerts...");

    setLoading(true);

    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(

      async position => {

        const { latitude, longitude } = position.coords;

        console.log("Location:", latitude, longitude);

        try {

          const data = await getNearbyAlerts(latitude, longitude);

          setAlerts(data);

        } catch (error) {

          console.log("Error obteniendo alertas:", error);

        }

        setLoading(false);

      },

      error => {

        console.log("Error GPS:", error);

        setLoading(false);

      },

      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000
      }

    );

  };


  useEffect(() => {

    loadNearbyAlerts();

  }, []);


  const confirmSupport = async (alertId: number) => {

    try {

      await respondToAlert(alertId);

      Alert.alert("Apoyo confirmado");

      loadNearbyAlerts();

    } catch (error) {

      console.log("Error confirmando apoyo:", error);

      Alert.alert("Error al confirmar apoyo");

    }

  };


  const openMap = (alert: any) => {

    navigation.navigate("AlertDetail", {
      alert
    });

  };


  const renderItem = ({ item }: any) => {

    const severityColor =
      item.alert_type?.toLowerCase() === "rojo"
        ? colors.alertHigh
        : colors.alertMedium;


    return (

      <View style={styles.card}>

        <View
          style={[
            styles.severityIndicator,
            { backgroundColor: severityColor }
          ]}
        />

        <View style={styles.cardContent}>

          <Text style={styles.location}>
            📍 {item.usuario?.nombre ?? "Usuario"}
          </Text>

          <Text
            style={{
              color: severityColor,
              fontWeight: "700",
              marginBottom: 4
            }}
          >
            {item.alert_type.toUpperCase()}
          </Text>

          <Text style={styles.time}>
            ⏱ {item.timestamp}
          </Text>

          <Text style={styles.coords}>
            Lat: {item.lat} | Lng: {item.lng}
          </Text>


          <View style={styles.actionsRow}>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => openMap(item)}
            >
              <Text style={styles.mapText}>
                Ver mapa
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[
                styles.supportButton,
                { backgroundColor: severityColor }
              ]}
              onPress={() => confirmSupport(item.id)}
            >
              <Text style={styles.supportText}>
                Confirmar apoyo
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>

    );

  };


  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>
          Alertas cercanas
        </Text>

        <Text style={styles.subtitle}>
          Personas cerca de ti necesitan ayuda
        </Text>

      </View>


      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadNearbyAlerts}
      />


      <TouchableOpacity
        style={{
          position: "absolute",
          left: 10,
          top: 10
        }}
        onPress={() => navigation.openDrawer()}
      >
        <Text style={{ fontSize: 24 }}>☰</Text>
      </TouchableOpacity>


    </SafeAreaView>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.lg
  },

  logo: {
    width: 70,
    height: 70,
    marginBottom: spacing.sm
  },

  title: {
    fontSize: typography.title,
    fontWeight: "600",
    color: colors.textPrimary
  },

  subtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: spacing.md,
    overflow: "hidden",
    shadowColor: "#2D3047",
    shadowOpacity: .08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },

  severityIndicator: {
    width: 6
  },

  cardContent: {
    flex: 1,
    padding: spacing.lg
  },

  location: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textPrimary
  },

  coords: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm
  },

  time: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  mapButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md
  },

  mapText: {
    color: colors.primary,
    fontWeight: "600"
  },

  supportButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12
  },

  supportText: {
    color: "white",
    fontWeight: "600"
  }

});