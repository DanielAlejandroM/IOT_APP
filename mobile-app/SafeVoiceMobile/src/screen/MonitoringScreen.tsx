import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../theme";

export default function MonitoringScreen({ navigation }: any) {
  const [isMonitoring, setIsMonitoring] = useState(false);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);

    if (!isMonitoring) {
      console.log("Monitoring iniciado");
    } else {
      console.log("Monitoring detenido");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>SAFEVOICE</Text>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          Estado del monitoreo
        </Text>

        <Text
          style={[
            styles.statusText,
            {
              color: isMonitoring
                ? colors.monitoringActive
                : colors.textSecondary,
            },
          ]}
        >
          {isMonitoring
            ? "Monitoreo activo"
            : "Monitoreo detenido"}
        </Text>
      </View>

      {/* Main Button */}
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
          {isMonitoring
            ? "Detener monitoreo"
            : "Activar monitoreo"}
        </Text>
      </TouchableOpacity>

      {/* Secondary Actions */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Alerts")}
      >
        <Text style={styles.secondaryText}>
          Ver alertas cercanas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor: colors.background,
alignItems:"center",
justifyContent:"center",
padding: spacing.lg
},

header:{
fontSize: typography.title,
fontWeight:"bold",
color: colors.textPrimary,
marginBottom: spacing.xl
},

statusCard:{
backgroundColor: colors.surface,
width:"100%",
borderRadius: spacing.sm,
padding: spacing.lg,
marginBottom: spacing.xl,
alignItems:"center"
},

statusTitle:{
fontSize: typography.caption,
color: colors.textSecondary,
marginBottom: spacing.sm
},

statusText:{
fontSize: typography.subtitle,
fontWeight:"bold"
},

mainButton:{
width:"100%",
padding: spacing.lg,
borderRadius: spacing.sm,
alignItems:"center",
marginBottom: spacing.md
},

mainButtonText:{
color: colors.white,
fontSize: typography.button,
fontWeight:"bold"
},

secondaryButton: {
  marginBottom: spacing.md,
  alignItems: "center"
},

secondaryText:{
fontSize: typography.body,
color: colors.primary
},

logoutButton: {
  marginTop: spacing.sm,
  alignItems: "center"
},

logoutText:{
fontSize: typography.caption,
color: colors.textSecondary
}

});