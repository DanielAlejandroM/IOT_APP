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

import { getNearbyAlerts } from "../services/nearbyAlertsService";
import { AlertItem } from "../types/alerts";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../theme";
import SafeVoiceNative from "../native/SafeVoiceNative";

const logo = require("../assets/safevoice_logo.png");

export default function MonitoringScreen({ navigation }: any) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<AlertItem[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

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

  const filterLastMinuteAlerts = (alerts: AlertItem[]) => {
    const now = new Date().getTime();

    return alerts.filter((alert) => {
      const alertTime = new Date(alert.timestamp).getTime();
      const diffMs = now - alertTime;
      return diffMs <= 60 * 1000;
    });
  };

  const loadRecentAlerts = async () => {
    try {
      setLoadingAlerts(true);

      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.log("[Monitoring] No hay token para consultar alertas cercanas");
        setRecentAlerts([]);
        return;
      }

      const data = await getNearbyAlerts(token);

      console.log("[Monitoring] nearby alerts response:", data);

      const filtered = filterLastMinuteAlerts(data.resultados || []);

      console.log("[Monitoring] alertas < 1 min:", filtered);

      setRecentAlerts(filtered);
    } catch (error) {
      console.log("[Monitoring] ERROR cargando alertas cercanas:", error);
      setRecentAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    loadRecentAlerts();

    const interval = setInterval(() => {
      loadRecentAlerts();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleMonitoring = async () => {
    try {
      if (!isMonitoring) {
        const granted = await requestPermissions();

        if (!granted) {
          Alert.alert(
            "Permisos requeridos",
            "Debes conceder permisos de micrófono y ubicación"
          );
          return;
        }

        const token = await AsyncStorage.getItem("access_token");

        console.log("[Monitoring] token:", token);

        if (!token) {
          Alert.alert("Error", "No se encontró token de acceso");
          return;
        }

        await SafeVoiceNative.startMonitoring(token);
        setIsMonitoring(true);
      } else {
        await SafeVoiceNative.stopMonitoring();
        setIsMonitoring(false);
      }
    } catch (error) {
      console.log("[Monitoring] ERROR toggleMonitoring:", error);
      Alert.alert("Error", "No se pudo cambiar el estado del monitoreo");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={logo}
            style={[
              styles.logo,
              {
                opacity: isMonitoring ? 1 : 0.35,
              },
            ]}
          />

          <Text style={styles.title}>SAFEVOICE</Text>

          <Text style={styles.subtitle}>
            Monitoreo comunitario inteligente
          </Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Estado actual</Text>

          <Text
            style={[
              styles.statusText,
              {
                color: isMonitoring ? colors.success : colors.textSecondary,
              },
            ]}
          >
            {isMonitoring ? "Monitoreo activo" : "Monitoreo detenido"}
          </Text>
        </View>

        <View style={styles.nearbyCard}>
          <Text style={styles.nearbyTitle}>Alertas recientes cercanas</Text>

          {loadingAlerts ? (
            <Text style={styles.nearbyEmpty}>Cargando alertas...</Text>
          ) : recentAlerts.length === 0 ? (
            <Text style={styles.nearbyEmpty}>
              No hay alertas registradas en el último minuto
            </Text>
          ) : (
            recentAlerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={styles.nearbyItem}>
                <Text
                  style={[
                    styles.nearbyType,
                    {
                      color:
                        alert.alert_type === "rojo"
                          ? colors.alertHigh
                          : "#F39C12",
                    },
                  ]}
                >
                  {alert.alert_type.toUpperCase()} - {alert.event_type}
                </Text>

                <Text style={styles.nearbyMeta}>
                  {alert.usuario?.nombre} · {alert.timestamp}
                </Text>

                <Text style={styles.nearbyMeta}>
                  Lat: {alert.lat} | Lng: {alert.lng}
                </Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.mainButton,
            {
              backgroundColor: isMonitoring
                ? colors.alertHigh
                : colors.primary,
            },
          ]}
          onPress={toggleMonitoring}
        >
          <Text style={styles.mainButtonText}>
            {isMonitoring ? "DETENER MONITOREO" : "ACTIVAR MONITOREO"}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => navigation.navigate("Alerts")}
          >
            <Text style={styles.alertText}>Ver alertas cercanas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },

  title: {
    marginTop: spacing.sm,
    fontSize: 26,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.caption,
    color: colors.textSecondary,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    padding: spacing.lg,
    borderRadius: 22,
    marginBottom: spacing.xl,
    alignItems: "center",
    shadowColor: "#2D3047",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  statusLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  statusText: {
    fontSize: 22,
    fontWeight: "600",
  },

  nearbyCard: {
    backgroundColor: "#FFFFFF",
    padding: spacing.lg,
    borderRadius: 22,
    marginBottom: spacing.xl,
    shadowColor: "#2D3047",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  nearbyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  nearbyEmpty: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },

  nearbyItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F5",
  },

  nearbyType: {
    fontSize: typography.body,
    fontWeight: "700",
    marginBottom: 4,
  },

  nearbyMeta: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },

  mainButton: {
    padding: spacing.lg,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  mainButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  actionsContainer: {
    alignItems: "center",
  },

  alertButton: {
    marginBottom: spacing.md,
  },

  alertText: {
    color: colors.primary,
    fontSize: typography.body,
  },

  logoutButton: {},

  logoutText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
});