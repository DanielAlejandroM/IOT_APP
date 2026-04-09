import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import apiClient from "../services/apiClient";
import { colors } from "../theme";

type AlertItem = {
    id: number;
    event_type: string;
    alert_type: string;
    lat: number;
    lng: number;
    timestamp: string;
    usuario: {
        nombre: string;
    };
};

export default function AlertHistoryScreen({ navigation }: any) {

    const [groupedAlerts, setGroupedAlerts] = useState<any>({});
    const [expandedDates, setExpandedDates] = useState<string[]>([]);

    /**
     * ================================
     * LOAD ALERTS
     * ================================
     */

    const loadAlerts = async () => {

        try {

            const response = await apiClient.get("/alerts?todo=true");

            const grouped = groupByDate(response.data?.resultados ?? []);

            setGroupedAlerts(grouped);

        } catch (error) {

            console.log("Error cargando alertas:", error);

        }

    };

    /**
     * ================================
     * AUTO REFRESH SOLO SI SCREEN ACTIVA
     * ================================
     */

    useFocusEffect(
        useCallback(() => {

            loadAlerts();

            const interval = setInterval(loadAlerts, 3000);

            return () => clearInterval(interval);

        }, [])
    );

    /**
     * ================================
     * GROUP ALERTS BY DATE
     * ================================
     */

    const groupByDate = (alerts: AlertItem[]) => {

        return alerts.reduce((acc: any, alert) => {

            const date = alert.timestamp.split("T")[0];

            if (!acc[date]) acc[date] = [];

            acc[date].push(alert);

            return acc;

        }, {});

    };

    /**
     * ================================
     * EXPAND DATE
     * ================================
     */

    const toggleDate = (date: string) => {

        if (expandedDates.includes(date)) {

            setExpandedDates(expandedDates.filter(d => d !== date));

        } else {

            setExpandedDates([...expandedDates, date]);

        }

    };

    /**
     * ================================
     * ALERT STYLE (SOFT BADGES)
     * ================================
     */

    const getAlertStyle = (type: string) => {

        if (type === "rojo") {

            return {
                label: "EMERGENCIA",
                color: "#D32F2F",
                badge: "#FFEAEA"
            };

        }

        if (type === "naranja") {

            return {
                label: "ALERTA MEDIA",
                color: "#F57C00",
                badge: "#FFF4E5"
            };

        }

        return {
            label: "EVENTO",
            color: "#5A6B85",
            badge: "#EEF3FA"
        };

    };

    /**
     * ================================
     * FORMAT DATE
     * ================================
     */

    const formatDate = (dateString: string) => {

        const date = new Date(dateString + "T00:00:00Z");

        return date.toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    };

    /**
     * ================================
     * FORMAT TIME (FIX UTC REAL)
     * ================================
     */

    const formatTime = (timestamp: string) => {

        const utcDate = new Date(timestamp + "Z");

        return utcDate.toLocaleTimeString("es-EC", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

    };

    /**
     * ================================
     * SORT DATES DESC
     * ================================
     */

    const sortedDates = Object.keys(groupedAlerts ?? {}).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    /**
     * ================================
     * RENDER
     * ================================
     */

    return (

        <SafeAreaView style={styles.container}>

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

            <Text style={styles.header}>
                Historial de alertas
            </Text>

            <FlatList

                data={sortedDates}

                keyExtractor={(item) => item}

                renderItem={({ item: date }) => {

                    const alerts = groupedAlerts[date] ?? [];

                    const isExpanded = expandedDates.includes(date);

                    return (

                        <View>

                            <TouchableOpacity
                                style={styles.dateHeader}
                                onPress={() => toggleDate(date)}
                            >

                                <Text style={styles.dateText}>
                                    {isExpanded ? "▼" : "▶"} {formatDate(date)}
                                </Text>

                                <Text style={styles.count}>
                                    {alerts.length} alertas
                                </Text>
                            </TouchableOpacity>

                            {

                                isExpanded &&

                                alerts.map((alert: AlertItem) => {

                                    const alertStyle = getAlertStyle(alert.alert_type);

                                    return (

                                        <View
                                            key={alert.id}
                                            style={styles.card}
                                        >

                                            <View
                                                style={[
                                                    styles.badge,
                                                    { backgroundColor: alertStyle.badge }
                                                ]}
                                            >

                                                <Text
                                                    style={{
                                                        color: alertStyle.color,
                                                        fontWeight: "700"
                                                    }}
                                                >
                                                    {alertStyle.label}
                                                </Text>

                                            </View>

                                            <Text style={styles.info}>
                                                👤 {alert.usuario.nombre}
                                            </Text>

                                            <Text style={styles.info}>
                                                🕒 {formatTime(alert.timestamp)}
                                            </Text>

                                            <Text style={styles.info}>
                                                📍 {alert.lat}, {alert.lng}
                                            </Text>

                                        </View>

                                    );

                                })

                            }

                        </View>

                    );

                }}

            />

        </SafeAreaView>

    );

}

/**
 * ================================
 * STYLES
 * ================================
 */

const styles = StyleSheet.create({

    container: {

        flex: 1,
        paddingStart: 50,
        paddingEnd: 45,
        paddingTop: 50,
        backgroundColor: colors.background


    },

    dateHeader: {

        backgroundColor: colors.surface,

        padding: 16,
        borderRadius: 16,
        color: colors.primary,
        marginBottom: 10,

        flexDirection: "row",

        justifyContent: "space-between",

        elevation: 2,

    },

    dateText: {

        fontWeight: "700",

        fontSize: 16

    },

    count: {

        color: colors.textSecondary,

    },

    card: {

        backgroundColor: "white",

        padding: 18,

        borderRadius: 18,

        marginBottom: 10,

        elevation: 2

    },

    badge: {

        alignSelf: "flex-start",

        paddingHorizontal: 12,

        paddingVertical: 6,

        borderRadius: 20,

        marginBottom: 8

    },
    header: {

      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      paddingBottom: 20,
      color:
        colors.textPrimary

    },

    info: {

        color: "#2D3047",

        marginTop: 4

    }

});