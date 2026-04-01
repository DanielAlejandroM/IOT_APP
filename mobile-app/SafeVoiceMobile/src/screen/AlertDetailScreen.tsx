import React from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

import MapView, {
    Marker
} from "react-native-maps";

import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../theme";


export default function AlertDetailScreen({ route }: any) {

    const { alert } = route.params;


    const severityColor =

        alert.severity === "high"

            ? colors.alertHigh

            : colors.alertMedium;


    return (

        <SafeAreaView style={styles.container}>


            <MapView

                style={styles.map}

                initialRegion={{

                    latitude: -0.180653,

                    longitude: -78.467834,

                    latitudeDelta: 0.01,

                    longitudeDelta: 0.01

                }}

            >

                <Marker

                    coordinate={{

                        latitude: -0.180653,

                        longitude: -78.467834

                    }}

                    title="Alerta activa"

                    description={alert.location}

                />

            </MapView>



            <View style={styles.infoCard}>


                <Text style={styles.location}>

                    📍 {alert.location}

                </Text>


                <Text style={styles.time}>

                    ⏱ {alert.time}

                </Text>


                <View

                    style={[

                        styles.severityBadge,

                        { backgroundColor: severityColor }

                    ]}

                >

                    <Text style={styles.severityText}>

                        Nivel {alert.severity}

                    </Text>

                </View>



                <TouchableOpacity

                    style={[

                        styles.supportButton,

                        { backgroundColor: severityColor }

                    ]}

                    onPress={() => console.log("Usuario va en camino")}

                >

                    <Text style={styles.supportText}>

                        VOY A AYUDAR

                    </Text>

                </TouchableOpacity>


            </View>


        </SafeAreaView>

    );

}



const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: colors.background

    },


    map: {

        flex: 1

    },


    infoCard: {

        backgroundColor: "white",

        padding: spacing.lg,

        borderTopLeftRadius: 30,

        borderTopRightRadius: 30,

        shadowColor: "#2D3047",

        shadowOpacity: .1,

        shadowRadius: 18,

        elevation: 10

    },


    location: {

        fontSize: typography.body,

        fontWeight: "600",

        color: colors.textPrimary,

        marginBottom: spacing.sm

    },


    time: {

        fontSize: typography.caption,

        color: colors.textSecondary,

        marginBottom: spacing.md

    },


    severityBadge: {

        alignSelf: "flex-start",

        paddingVertical: spacing.xs,

        paddingHorizontal: spacing.md,

        borderRadius: 12,

        marginBottom: spacing.md

    },


    severityText: {

        color: "white",

        fontWeight: "600"

    },


    supportButton: {

        padding: spacing.lg,

        borderRadius: 18,

        alignItems: "center"

    },


    supportText: {

        color: "white",

        fontSize: 18,

        fontWeight: "600"

    }

});