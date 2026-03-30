import React from "react";
import { View, Text, Button } from "react-native";

export default function LoginScreen({ navigation }: any) {
    return (
        <View>
            <Text>Login Screen now</Text>
          <Button
          title = "Crear cuenta"
          onPress={() => navigation.navigate("RegisterScreen")}
          />
        </View>
    );
}   