import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getNearbyAlerts } from "../services/nearbyAlertsService";
import { AlertItem } from "../types/alerts";

import { colors, spacing, typography } from "../theme";
import SafeVoiceNative from "../native/SafeVoiceNative";
import apiClient from "../services/apiClient";

const logo = require("../assets/safevoice_logo.png");

// ventana visible = 1 minuto
const ALERT_WINDOW_MS = 60 * 1000;

export default function MonitoringScreen({ navigation }: any) {

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<AlertItem[]>([]);
  const [activo, setActivo] = useState(false);

  /*
 ================================
 BACKEND STATUS
 ================================
 */

  const verificarBackend = async () => {

    try {

      await apiClient.get("/health");

      setActivo(true);

    } catch {

      setActivo(false);

    }

  };

  /*
 ================================
 PERMISSIONS
 ================================
 */

  const requestPermissions = async () => {

    if (Platform.OS !== "android") return true;

    const mic = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return (
      mic === PermissionsAndroid.RESULTS.GRANTED &&
      fine === PermissionsAndroid.RESULTS.GRANTED
    );

  };

  /*
 ================================
 ALERT FILTER (1 minuto + no propias)
 ================================
 */

  const filterRecentAlerts = async (alerts: AlertItem[]) => {

  const now = Date.now();

  const currentUserName =
    await AsyncStorage.getItem("user_name");

  return alerts.filter(alert => {

    const alertTime =
      new Date(alert.timestamp + "Z").getTime();

    const diff =
      now - alertTime;

    console.log("DIFF MS:", diff);

    const isRecent =
      diff >= 0 && diff <= ALERT_WINDOW_MS;

    const notMine =
      alert.usuario?.email !== currentUserName;

    console.log("IS RECENT:", isRecent);
    console.log("NOT MINE:", notMine);

    return isRecent && notMine;

  });

};

  /*
 ================================
 LOAD ALERTS
 ================================
 */

  const loadRecentAlerts = async () => {

    try {

      const token =
        await AsyncStorage.getItem("access_token");

      if (!token) {

        setRecentAlerts([]);

        return;

      }

      const lat = -0.1972097;
      const lng = -78.5020647;

      const data =
        await getNearbyAlerts(token, lat, lng);

      const filtered =
        await filterRecentAlerts(
          data.resultados ?? []
        );

      setRecentAlerts(filtered);

    } catch {

      setRecentAlerts([]);

    }

  };

  /*
 ================================
 INIT
 ================================
 */

  useEffect(() => {

    verificarBackend();

    loadRecentAlerts();

    const interval =
      setInterval(loadRecentAlerts, 15000);

    return () => clearInterval(interval);

  }, []);

  /*
 ================================
 MONITORING TOGGLE
 ================================
 */

  const toggleMonitoring = async () => {

    try {

      if (!isMonitoring) {

        const granted =
          await requestPermissions();

        if (!granted) {

          Alert.alert(
            "Permisos requeridos",
            "Debes conceder permisos"
          );

          return;

        }

        const token =
          await AsyncStorage.getItem("access_token");
        console.log("TOKEN MONITORING:", token);

        if (!token) {

          Alert.alert("Error", "Token no encontrado");

          return;

        }

        await SafeVoiceNative.startMonitoring(token);
        console.log("Simulando monitoreo activo");
        setIsMonitoring(true);

      } else {

        await SafeVoiceNative.stopMonitoring();

        setIsMonitoring(false);

      }

    } catch {

      Alert.alert("Error", "No se pudo cambiar monitoreo");

    }

  };

  /*
 ================================
 HELPERS
 ================================
 */

  const getSeverityColor = (type: string) => {

    if (type === "rojo") return "#E9424B";

    if (type === "naranja") return "#F0A15A";

    return "#BDBDBD";

  };

  const formatRelativeTime = (timestamp: string) => {

    const alertTime =
      new Date(timestamp + "Z").getTime();

    const diff =
      Date.now() - alertTime;

    const seconds =
      Math.floor(diff / 1000);

    return `Hace ${seconds}s`;

  };

  /*
 ================================
 LOGOUT
 ================================
 */

  const logout = async () => {

    await AsyncStorage.removeItem("access_token");

    navigation.replace("Login");

  };

  /*
 ================================
 UI
 ================================
 */

  return (

    <SafeAreaView style={styles.container}>

      {/* BACKEND STATUS */}

      <View
        style={[
          styles.backendBadge,
          {
            backgroundColor:
              activo ? "#bcf5d1" : "#FFEAEA"
          }
        ]}
      >

        <Text style={{ fontWeight: "800" }}>
          {activo ? "ACTIVE 🟢" : "OFFLINE 🔴"}
        </Text>

      </View>


      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <Image
            source={logo}
            style={[
              styles.logo,
              { opacity: isMonitoring ? 1 : 0.4 }
            ]}
          />

          <Text style={styles.title}>
            SAFEVOICE
          </Text>

          <Text style={styles.subtitle}>
            Monitoreo comunitario inteligente
          </Text>

        </View>


        {/* STATUS */}

        <View style={styles.statusCard}>

          <Text style={styles.statusLabel}>
            Estado actual
          </Text>

          <Text
            style={[
              styles.statusText,
              {
                color:
                  isMonitoring
                    ? colors.success
                    : colors.textSecondary
              }
            ]}
          >

            {isMonitoring
              ? "Monitoreo activo"
              : "Monitoreo detenido"}

          </Text>

        </View>


        {/* BUTTON */}

        <TouchableOpacity
          style={[
            styles.mainButton,
            {
              backgroundColor:
                isMonitoring
                  ? colors.monitoringInactive
                  : colors.primary
            }
          ]}
          onPress={toggleMonitoring}
        >

          <Text style={styles.mainButtonText}>

            {isMonitoring
              ? "DETENER MONITOREO"
              : "ACTIVAR MONITOREO"}

          </Text>

        </TouchableOpacity>


        {/* ALERTAS (solo si existen) */}

        {recentAlerts.length > 0 && (

          <View style={styles.nearbySection}>

            <Text style={styles.nearbySectionTitle}>
              Alertas cercanas
            </Text>

            <Text style={styles.nearbySectionSubtitle}>
              Personas cerca de ti necesitan ayuda
            </Text>


            {recentAlerts.slice(0, 3).map(alert => (

              <View
                key={alert.id}
                style={styles.card}
              >

                <View
                  style={[
                    styles.severityIndicator,
                    {
                      backgroundColor:
                        getSeverityColor(
                          alert.alert_type
                        )
                    }
                  ]}
                />

                <View style={styles.cardContent}>

                  <Text style={styles.location}>
                    👤 {alert.usuario.nombre}
                  </Text>

                  <Text style={styles.time}>
                    ⏱ {formatRelativeTime(
                      alert.timestamp
                    )}
                  </Text>

                </View>

              </View>

            ))}

          </View>

        )}


        {/* ACTIONS */}

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

      </ScrollView>

    </SafeAreaView>

  );

}


/*
 ================================
 STYLES
 ================================
 */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },

  scrollContent: {
    flexGrow: 1
  },

  backendBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    elevation: 5,
    zIndex: 500
  },

  header: {
    alignItems: "center",
    marginTop: 75,
    marginBottom: spacing.lg
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 30
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

  statusCard: {
    backgroundColor: "#FFFFFF",
    padding: spacing.lg,
    borderRadius: 22,
    marginBottom: spacing.xl,
    alignItems: "center",
    elevation: 6
  },

  statusLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary
  },

  statusText: {
    fontSize: 22,
    fontWeight: "600"
  },

  mainButton: {
    padding: spacing.lg,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: spacing.xl
  },

  mainButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },

  nearbySection: {
    marginBottom: spacing.xl
  },

  nearbySectionTitle: {
    fontSize: typography.title,
    fontWeight: "600",
    color: colors.textPrimary
  },

  nearbySectionSubtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: spacing.md,
    elevation: 5
  },

  severityIndicator: {
    width: 6,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
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

  time: {
    fontSize: typography.caption,
    color: colors.textSecondary
  },

  actionsContainer: {
    alignItems: "center"
  },

  alertText: {
    color: colors.primary,
    fontSize: typography.body
  },

  logoutText: {
    color: colors.textSecondary,
    fontSize: typography.caption
  }

});