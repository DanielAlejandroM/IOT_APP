import React from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { loginUser } from "../services/authServices";
import { colors, spacing, typography } from "../theme";


const logo = require("../assets/safevoice_logo.png");

export default function LoginScreen({ navigation }: any) {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {

        if (!email || !password) {
            setMessage("Completa los campos");
            return;
        }
        try {
            setLoading(true);
            const response = await loginUser(email, password);
            const token = response.access_token;
            await AsyncStorage.setItem("access_token", response.access_token);
            await AsyncStorage.setItem("user_name", email);

            console.log("Token guardado:", token);
    
            navigation.replace("MainDrawer");

        } catch (error) {

            setMessage("Credenciales incorrectas");

        } finally {

            setLoading(false);

        }

    };


    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <Image source={logo} style={styles.logo} />

                <Text style={styles.title}>SAFEVOICE</Text>

                <Text style={styles.subtitle}>

                    Monitoreo comunitario inteligente

                </Text>

            </View>


            <View style={styles.card}>

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

                    style={styles.loginButton}

                    onPress={handleLogin}

                    disabled={loading}

                >

                    {

                        loading

                            ?

                            <ActivityIndicator color="white" />

                            :

                            <Text style={styles.loginText}>

                                INICIAR SESIÓN

                            </Text>

                    }

                </TouchableOpacity>

            </View>


            <TouchableOpacity

                style={styles.registerContainer}

                onPress={() => navigation.navigate("Register")}

            >

                <Text style={styles.registerText}>

                    ¿No tienes cuenta? Crear cuenta

                </Text>

            </TouchableOpacity>


            {

                message

                    ?

                    <Text style={styles.message}>

                        {message}

                    </Text>

                    :

                    null

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

    loginButton: {

        backgroundColor: colors.primary,

        padding: spacing.md,

        borderRadius: 14,

        alignItems: "center"

    },

    loginText: {

        color: "white",

        fontWeight: "600",

        fontSize: typography.button

    },

    registerContainer: {

        alignItems: "center",

        marginTop: spacing.lg

    },

    registerText: {

        color: colors.primary,

        fontSize: typography.body

    },

    message: {

        marginTop: spacing.md,
        textAlign: "center",
        color: "#f36c63",
        fontSize: 18,
        fontWeight: "600"


    }

});