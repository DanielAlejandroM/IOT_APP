import React, { useState} from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { registerUser } from "../services/authServices";
import { colors } from "../theme/colors";

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleRegister = async () => {
        try {
            await registerUser(email, password);

            setMessage("Registro exitoso. Por favor, inicie sesión.");
            
            navigation.navigate("Login");
        }catch (err) {
            setMessage("Error al registrar. Intente nuevamente.");
            console.error(err); 
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro SAFEVOICE</Text>
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Registrarse" onPress={handleRegister} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center",
            padding: 20,
        },
        title: {    
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: colors.primary,
            textAlign: "center", 
        },
        input: {
            backgroundColor: "white",
            marginBottom: 15,
            padding: 10,
            borderRadius: 6,
        },
        message: {
            marginTop: 15,
            color: "red",
            textAlign: "center",
        },
    });