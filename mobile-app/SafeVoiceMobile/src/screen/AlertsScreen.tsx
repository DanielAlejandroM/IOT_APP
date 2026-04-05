import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../theme";

const logo = require("../assets/safevoice_logo.png");


const mockAlerts = [

  {
    id: "1",
    location: "Av. América y Universitaria",
    time: "Hace 2 min",
    severity: "high"
  },

  {
    id: "2",
    location: "La Gasca",
    time: "Hace 5 min",
    severity: "medium"
  }

];


export default function AlertsScreen({ navigation }: any) {

  const confirmSupport = (alertId: string) => {

    console.log("Confirmando apoyo:", alertId);

  };


  const openMap = (alert: any) => {

    navigation.navigate("AlertDetail", {

      alert

    });

  };


  const renderItem = ({ item }: any) => {

    const severityColor =

      item.severity === "high"

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

            📍 {item.location}

          </Text>


          <Text style={styles.time}>

            ⏱ {item.time}

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

        data={mockAlerts}

        keyExtractor={(item) => item.id}

        renderItem={renderItem}

      />


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

    color: colors.textPrimary,

    marginBottom: spacing.xs

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