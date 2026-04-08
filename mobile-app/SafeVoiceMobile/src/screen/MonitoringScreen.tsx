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

  // Ventana de visibilidad: 4h 59min
  const ALERT_WINDOW_MS = 299 * 60 * 1000;

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

  const filterRecentAlerts = (alerts: AlertItem[]) => {
    const now = Date.now();

    return alerts.filter((alert) => {
      const alertTime = new Date(alert.timestamp + "Z").getTime();
      const diffMs = now - alertTime;

      console.log("[Monitoring] now:", now);
      console.log("[Monitoring] alertTime UTC:", alertTime);
      console.log("[Monitoring] diffMs:", diffMs, "alert id:", alert.id);

      return diffMs >= 0 && diffMs <= ALERT_WINDOW_MS;
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = Date.now();
    const alertTime = new Date(timestamp + "Z").getTime();
    const diffMs = now - alertTime;

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffMinutes <= 0) {
      return `Hace ${Math.max(diffSeconds, 1)} seg`;
    }

    return `Hace ${diffMinutes} min`;
  };

  const formatTime = (timestamp: string) => {
    const utcDate = new Date(timestamp + "Z");

    return utcDate.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getSeverityColor = (type: string) => {
    if (type === "rojo") return "#E9424B";
    if (type === "naranja") return "#F0A15A";
    return "#BDBDBD";
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

      // Usa coordenadas fijas o reemplázalas por GPS real luego
      const lat = -0.1807;
      const lng = -78.4678;

      const data = await getNearbyAlerts(token, lat, lng);

      console.log("[Monitoring] nearby alerts response:", data);
      console.log("[Monitoring] resultados raw:", data.resultados);

      const filtered = filterRecentAlerts(data.resultados || []);

      console.log("[Monitoring] alertas filtradas:", filtered);

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

  const openMap = (alert: AlertItem) => {
    Alert.alert(
      "Mapa",
      `Aquí luego puedes abrir el mapa con:\nLat: ${alert.lat}\nLng: ${alert.lng}`
    );
  };

  const confirmSupport = (alert: AlertItem) => {
    Alert.alert(
      "Confirmar apoyo",
      `Aquí luego puedes conectar la acción de apoyo para la alerta #${alert.id}`
    );
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

        <View style={styles.nearbySection}>
          <Text style={styles.nearbySectionTitle}>Alertas cercanas</Text>
          <Text style={styles.nearbySectionSubtitle}>
            Personas cerca de ti necesitan ayuda
          </Text>

          {loadingAlerts ? (
            <Text style={styles.nearbyEmpty}>Cargando alertas...</Text>
          ) : recentAlerts.length === 0 ? (
            <Text style={styles.nearbyEmpty}>
              No hay alertas registradas en las últimas 4h 59min
            </Text>
          ) : (
            recentAlerts.slice(0, 3).map((alert) => (
              <View key={alert.id} style={styles.card}>
                <View
                  style={[
                    styles.severityIndicator,
                    { backgroundColor: getSeverityColor(alert.alert_type) },
                  ]}
                />

                <View style={styles.cardContent}>
                  <Text style={styles.location}>
                    📍 {alert.usuario?.nombre || "Alerta cerca de tu ubicación"}
                  </Text>

                  <Text style={styles.coords}>
                    Lat: {alert.lat}, Lng: {alert.lng}
                  </Text>

                  <Text style={styles.time}>
                    ◔ {formatRelativeTime(alert.timestamp)} •{" "}
                    {formatTime(alert.timestamp)}
                  </Text>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() => openMap(alert)}
                    >
                      <Text style={styles.mapText}>Ver mapa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.supportButton,
                        { backgroundColor: getSeverityColor(alert.alert_type) },
                      ]}
                      onPress={() => confirmSupport(alert)}
                    >
                      <Text style={styles.supportText}>Confirmar apoyo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

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
    padding: spacing.lg,
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  logo: {
    width: 70,
    height: 70,
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: typography.title,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  subtitle: {
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

  nearbySection: {
    marginBottom: spacing.xl,
  },

  nearbySectionTitle: {
    fontSize: typography.title,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  nearbySectionSubtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  nearbyEmpty: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: spacing.md,
    overflow: "hidden",
    shadowColor: "#2D3047",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  severityIndicator: {
    width: 6,
  },

  cardContent: {
    flex: 1,
    padding: spacing.lg,
  },

  location: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  coords: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  time: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  mapButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  mapText: {
    color: colors.primary,
    fontWeight: "600",
  },

  supportButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },

  supportText: {
    color: "white",
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