import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { registerUser } from "../services/authServices";
import { colors, spacing, typography } from "../theme";

export default function RegisterScreen({ navigation }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleRegister = async () => {

    try {

      await registerUser(email, password);

      setIsError(false);
      setMessage("Usuario creado correctamente");

      navigation.navigate("Login");

    } catch (error) {

      setIsError(true);
      setMessage("Error al registrar usuario");

      console.log(error);
    }
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Crear cuenta SAFEVOICE
      </Text>

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

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          Registrarse
        </Text>
      </TouchableOpacity>

      {message ? (

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

      ) : null}

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
  },

  title: {
    fontSize: typography.title,
    marginBottom: spacing.xl,
    color: colors.textPrimary,
    textAlign: "center",
  },

  input: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: spacing.sm,
  },

  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: "center",
  },

  buttonText: {
    color: colors.white,
    fontSize: typography.button,
    fontWeight: "bold",
  },

  message: {
    marginTop: spacing.md,
    fontSize: typography.body,
    textAlign: "center",
  },

  linkContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },

  link: {
    color: colors.secondary,
    fontSize: typography.caption,
  },

});