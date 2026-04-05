import React, { useState } from "react";
import {
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    ActivityIndicator
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/Feather";

import { registerUser } from "../services/authServices";

import { colors, spacing, typography } from "../theme";

const logo = require("../assets/safevoice_logo.png");


export default function RegisterScreen({ navigation }: any) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    const handleRegister = async () => {

        if (!email || !password) {

            setMessage("Completa los campos");

            return;

        }

        try {

            setLoading(true);

            await registerUser(username, email, password);

            setIsError(false);

            navigation.replace("Login");

        } catch (error) {

            setIsError(true);

            setMessage("Error al registrar usuario");

        } finally {

            setLoading(false);

        }

    };


    return (

        <SafeAreaView style={styles.container}>


            <View style={styles.header}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>
                    Crear cuenta SAFEVOICE
                </Text>

                <Text style={styles.subtitle}>
                    Sistema de monitoreo comunitario
                </Text>
            </View>

            <View style={styles.card}>

                <View style={styles.inputWrapper}>
                    <Icon name="user" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Nombre de usuario"
                        placeholderTextColor={colors.textSecondary}
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Icon name="mail" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Correo electrónico"
                        placeholderTextColor={colors.textSecondary}
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Icon name="lock" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Contraseña"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />

                </View>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {
                        loading
                            ?
                            <ActivityIndicator color="white" />
                            :
                            <Text style={styles.registerText}>
                                REGISTRARSE
                            </Text>
                    }
                </TouchableOpacity>

            </View>
            <TouchableOpacity
                style={styles.loginContainer}
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={styles.loginLink}>
                    ¿Ya tienes cuenta? Inicia sesión
                </Text>
            </TouchableOpacity>
            {
                message !== "" &&
                <Text
                    style={[
                        styles.message,
                        {
                            color: isError
                                ? colors.alertHigh
                                : colors.success
                        }
                    ]}
                >
                    {message}
                </Text>
            }
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
        width: 110,
        height: 110,
        borderRadius: 26
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

    card: {
        backgroundColor: "#FFFFFF",
        padding: spacing.lg,
        borderRadius: 22,

        shadowColor: "#2D3047",
        shadowOpacity: .08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },

        elevation: 6
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#E6F2F0",

        borderRadius: 14,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md
    },

    input: {
        flex: 1,
        padding: spacing.md
    },

    registerButton: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: 14,
        alignItems: "center"
    },

    registerText: {
        color: "white",
        fontWeight: "600",
        fontSize: typography.button
    },

    loginContainer: {
        alignItems: "center",
        marginTop: spacing.lg
    },

    loginLink: {
        color: colors.primary,
        fontSize: typography.body
    },

    message: {
        marginTop: spacing.md,
        textAlign: "center"
    }

});