import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Image
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import apiClient from "../services/apiClient";
import { colors } from "../theme";

const logo = require("../assets/safevoice_logo.png");

type AlertItem = {
  id: number;
  event_type: string;
  alert_type: string;
  lat: number;
  lng: number;
  timestamp: string;
  usuario: {
    email: string;
    nombre: string;
  };
};

export default function AlertsScreen({ navigation }: any) {

  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  /*
 ================================
 VALIDAR ALERTA < 2 HORAS
 ================================
 */

 const isRecentAlert = (timestamp: string) => {

  const alertTime = new Date(timestamp + "Z").getTime();

  const now = Date.now();

  const diffMs = now - alertTime;

  const diffHours = diffMs / (1000 * 60 * 60);

  console.log("Diff hours:", diffHours);

  return diffHours >= 0 && diffHours <= 2;

};

  /*
 ================================
 LOAD ALERTS
 ================================
 */

  const loadAlerts = async () => {

    try {

      const currentUserEmail =
        await AsyncStorage.getItem("user_name");

      console.log("Usuario actual:", currentUserEmail);

      const response =
        await apiClient.get("/alerts?todo=true");

      console.log(
        "TOTAL BACKEND:",
        response.data.resultados.length
      );

      const filteredAlerts =
        (response.data?.resultados ?? []).filter(

          (alert: AlertItem) => {

            const notMyAlert =
              alert.usuario?.email !== currentUserEmail;

            const stillValid =
              isRecentAlert(alert.timestamp);

            console.log(
              "ALERT USER:",
              alert.usuario?.email
            );

            return notMyAlert && stillValid;

          }

        );

      console.log(
        "TOTAL FILTRADAS:",
        filteredAlerts.length
      );

      setAlerts(filteredAlerts);

    } catch (error) {

      console.log(
        "Error cargando alertas:",
        error
      );

    }

  };

  /*
 ================================
 AUTO REFRESH CADA 3 SEG
 ================================
 */

  useFocusEffect(
    useCallback(() => {

      loadAlerts();

      const interval =
        setInterval(loadAlerts, 3000);

      return () =>
        clearInterval(interval);

    }, [])
  );

  /*
 ================================
 ALERT STYLE
 ================================
 */

  const getAlertStyle = (type: string) => {

    if (type === "rojo") {

      return {
        label: "EMERGENCIA",
        color: "#E53935"
      };

    }

    if (type === "naranja") {

      return {
        label: "ALERTA MEDIA",
        color: "#F2994A"
      };

    }

    return {
      label: "EVENTO",
      color: colors.textSecondary
    };

  };

  /*
 ================================
 TIME AGO
 ================================
 */

  const timeAgo = (timestamp: string) => {

    const alertDate =
      new Date(timestamp).getTime();

    const diff =
      Date.now() - alertDate;

    const minutes =
      Math.floor(diff / 60000);

    if (minutes < 1)
      return "Hace segundos";

    if (minutes < 60)
      return `Hace ${minutes} min`;

    const hours =
      Math.floor(minutes / 60);

    return `Hace ${hours} h`;

  };

  /*
 ================================
 OPEN MAP
 ================================
 */

  const openMap = (
    lat: number,
    lng: number
  ) => {

    Linking.openURL(
      `https://maps.google.com/?q=${lat},${lng}`
    );

  };

  /*
 ================================
 CONFIRM SUPPORT
 ================================
 */

  const confirmSupport = (
    id: number
  ) => {

    console.log(
      "Confirmando apoyo:",
      id
    );

  };

  /*
 ================================
 RENDER CARD
 ================================
 */

  const renderItem = ({
    item
  }: {
    item: AlertItem;
  }) => {

    const style =
      getAlertStyle(item.alert_type);

    return (

      <View style={styles.cardContainer}>

        <View
          style={[
            styles.priorityBar,
            {
              backgroundColor:
                style.color
            }
          ]}
        />

        <View style={styles.card}>

          <Text style={styles.eventLabel}>
            {style.label}
          </Text>

          <Text style={styles.user}>
            👤 {item.usuario.nombre}
          </Text>

          <Text style={styles.time}>
            ⏱ {timeAgo(item.timestamp)}
          </Text>

          <View style={styles.actions}>

            <TouchableOpacity
              onPress={() =>
                openMap(
                  item.lat,
                  item.lng
                )
              }
            >
              <Text style={styles.mapButton}>
                Ver mapa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.supportButton,
                {
                  backgroundColor:
                    style.color
                }
              ]}
              onPress={() =>
                confirmSupport(
                  item.id
                )
              }
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

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.openDrawer()
        }
      >
        <Text style={{ fontSize: 24 }}>
          ☰
        </Text>
      </TouchableOpacity>

      <Image
        source={logo}
        style={styles.logo}
      />

      <Text style={styles.header}>
        Alertas cercanas
      </Text>

      <Text style={styles.subtitle}>
        Personas cerca de ti necesitan ayuda
      </Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderItem}
      />

    </SafeAreaView>

  );

}

/*
 ================================
 STYLES
 ================================
 */

const styles =
  StyleSheet.create({

    container: {

      flex: 1,
      backgroundColor:
        colors.background,
      paddingHorizontal: 20

    },

    menuButton: {

      position: "absolute",
      left: 10,
      top: 10,
      zIndex: 10

    },

    logo: {

      width: 90,
      height: 90,
      alignSelf: "center",
      marginTop: 40,
      marginBottom: 10

    },

    header: {

      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      color:
        colors.textPrimary

    },

    subtitle: {

      textAlign: "center",
      marginBottom: 20,
      color:
        colors.textSecondary

    },

    cardContainer: {

      flexDirection: "row",
      width: "100%",
      marginBottom: 14

    },

    priorityBar: {

      width: 6,
      borderRadius: 6

    },

    card: {

      flex: 1,
      backgroundColor:
        colors.surface,
      padding: 18,
      borderRadius: 18,
      marginLeft: 10,
      elevation: 2

    },

    eventLabel: {

      fontSize: 16,
      fontWeight: "700",
      color:
        colors.textPrimary

    },

    user: {

      marginTop: 4,
      color:
        colors.textSecondary

    },

    time: {

      marginTop: 6,
      color:
        colors.textSecondary

    },

    actions: {

      flexDirection: "row",
      justifyContent:
        "space-between",
      marginTop: 14

    },

    mapButton: {

      color: colors.primary,
      fontWeight: "600"

    },

    supportButton: {

      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 14

    },

    supportText: {

      color: "white",
      fontWeight: "600"

    }

  });