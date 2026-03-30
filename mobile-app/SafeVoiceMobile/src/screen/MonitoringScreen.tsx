import React from "react";
import { View, Text, Button } from "react-native";

export default function MonitoringScreen({ navigation }: any) {
    return (
        <View>
            <Text>Monitoring Screen</Text>
          <Button
          title = "Ir a Alerts"
          onPress={() => navigation.navigate("Alerts")}
          />
        </View>
    );
}