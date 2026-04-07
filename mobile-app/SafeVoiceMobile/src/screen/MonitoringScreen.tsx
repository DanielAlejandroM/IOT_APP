import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../theme";
import SafeVoiceNative from "../native/SafeVoiceNative";

const logo = require("../assets/safevoice_logo.png");


export default function MonitoringScreen({ navigation }: any) {

  const [isMonitoring, setIsMonitoring] = useState(false);


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

      await SafeVoiceNative.startMonitoring();
      setIsMonitoring(true);
    } else {
      await SafeVoiceNative.stopMonitoring();
      setIsMonitoring(false);
    }
  } catch (error) {
    Alert.alert("Error", "No se pudo cambiar el estado del monitoreo");
  }
};


  const logout = async () => {

    await AsyncStorage.removeItem("access_token");

    navigation.replace("Login");

  };


  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>


        <Image

          source={logo}

          style={[

            styles.logo,

            {

              opacity: isMonitoring ? 1 : .35

            }

          ]}

        />


        <Text style={styles.title}>

          SAFEVOICE

        </Text>


        <Text style={styles.subtitle}>

          Monitoreo comunitario inteligente

        </Text>


      </View>


      <View style={styles.statusCard}>

        <Text style={styles.statusLabel}>

          Estado actual

        </Text>


        <Text

          style={[

            styles.statusText,

            {

              color: isMonitoring

                ? colors.success

                : colors.textSecondary

            }

          ]}

        >

          {

            isMonitoring

              ? "Monitoreo activo"

              : "Monitoreo detenido"

          }

        </Text>


      </View>



      <TouchableOpacity

        style={[

          styles.mainButton,

          {

            backgroundColor: isMonitoring

              ? colors.alertHigh

              : colors.primary

          }

        ]}

        onPress={toggleMonitoring}

      >

        <Text style={styles.mainButtonText}>

          {

            isMonitoring

              ? "DETENER MONITOREO"

              : "ACTIVAR MONITOREO"

          }

        </Text>

      </TouchableOpacity>



      <View style={styles.actionsContainer}>


        <TouchableOpacity

          style={styles.alertButton}

          onPress={() => navigation.navigate("Alerts")}

        >

          <Text style={styles.alertText}>

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


    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: colors.background,

    justifyContent: "center",

    padding: spacing.lg

  },


  header: {

    alignItems: "center",

    marginBottom: spacing.xl

  },


  logo: {

    width: 120,

    height: 120,

    borderRadius: 30

  },


  title: {

    marginTop: spacing.sm,

    fontSize: 26,

    fontWeight: "600",

    color: colors.textPrimary

  },


  subtitle: {

    marginTop: spacing.xs,

    fontSize: typography.caption,

    color: colors.textSecondary

  },


  statusCard: {

    backgroundColor: "#FFFFFF",

    padding: spacing.lg,

    borderRadius: 22,

    marginBottom: spacing.xl,

    alignItems: "center",

    shadowColor: "#2D3047",

    shadowOpacity: .08,

    shadowRadius: 16,

    shadowOffset: { width: 0, height: 6 },

    elevation: 6

  },


  statusLabel: {

    fontSize: typography.caption,

    color: colors.textSecondary,

    marginBottom: spacing.sm

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


  actionsContainer: {

    alignItems: "center"

  },


  alertButton: {

    marginBottom: spacing.md

  },


  alertText: {

    color: colors.primary,

    fontSize: typography.body

  },


  logoutButton: {


  },


  logoutText: {

    color: colors.textSecondary,

    fontSize: typography.caption

  }

});