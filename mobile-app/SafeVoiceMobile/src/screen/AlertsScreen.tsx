import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { colors, spacing, typography } from "../theme";

const mockAlerts = [
  {
    id: "1",
    location: "Av. América y Universitaria",
    time: "Hace 2 min",
    severity: "high",
  },
  {
    id: "2",
    location: "La Gasca",
    time: "Hace 5 min",
    severity: "medium",
  },
];

export default function AlertsScreen() {
  const confirmSupport = (alertId: string) => {
    console.log("Confirmando apoyo:", alertId);
  };

  const renderItem = ({ item }: any) => {
    const severityColor =
      item.severity === "high"
        ? colors.alertHigh
        : colors.alertMedium;

    return (
      <View style={styles.card}>
        {/* Severity indicator */}
        <View
          style={[
            styles.severityIndicator,
            { backgroundColor: severityColor },
          ]}
        />

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.location}>
            📍 {item.location}
          </Text>

          <Text style={styles.time}>
            ⏱ {item.time}
          </Text>

          <TouchableOpacity
            style={[
              styles.supportButton,
              { backgroundColor: severityColor },
            ]}
            onPress={() => confirmSupport(item.id)}
          >
            <Text style={styles.supportText}>
              Confirmar apoyo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>
        Alertas cercanas
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Personas cerca de ti necesitan ayuda
      </Text>

      {/* List */}
      <FlatList
        data={mockAlerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor: colors.background,
padding: spacing.lg
},

header:{
fontSize: typography.title,
fontWeight:"bold",
color: colors.textPrimary,
marginBottom: spacing.xs
},

subtitle:{
fontSize: typography.caption,
color: colors.textSecondary,
marginBottom: spacing.lg
},

card:{
flexDirection:"row",
backgroundColor: colors.surface,
borderRadius: spacing.sm,
marginBottom: spacing.md,
overflow:"hidden"
},

severityIndicator:{
width: spacing.xs
},

cardContent:{
flex:1,
padding: spacing.lg
},

location:{
fontSize: typography.body,
fontWeight:"600",
color: colors.textPrimary,
marginBottom: spacing.xs
},

time:{
fontSize: typography.caption,
color: colors.textSecondary,
marginBottom: spacing.sm
},

supportButton: {
  paddingVertical: spacing.sm,
  borderRadius: spacing.sm,
  alignItems: "center",
},

supportText:{
color: colors.white,
fontWeight:"bold",
fontSize: typography.caption
}

});