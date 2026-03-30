import React from "react";
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/authServices";
import { colors, spacing, typography } from "../theme";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);

            await AsyncStorage.setItem(
                "access_token",
                response.access_token
            );

            setMessage("Inicio de sesión exitoso.");

            navigation.navigate("Monitoreo");
        } catch (error) {
            setMessage("Error al iniciar sesión. Verifique sus credenciales.");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SAFEVOICE</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Login" onPress={handleLogin} />

            <Button
                title="Crear cuenta"
                onPress={() => navigation.navigate("Register")}
            />

            <Text>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor: colors.background,
justifyContent:"center",
padding: spacing.lg
},

title:{
fontSize: typography.title,
marginBottom: spacing.xl,
color: colors.textPrimary
},

input:{
backgroundColor: colors.white,
marginBottom: spacing.md,
padding: spacing.md,
borderRadius: spacing.sm
}

});