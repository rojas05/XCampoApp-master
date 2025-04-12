import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../src/theme/theme.js";
import StyledButton from "../../styles/StyledButton.jsx";

const CustomAlert = ({ visible, title, message, onAccept }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name="alert-circle-outline"
          size={80}
          color={theme.colors.red}
        />
        <Text style={styles.message}>{message}</Text>

        <StyledButton green onPress={onAccept} title="Aceptar" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  message: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginVertical: 10,
    textAlign: "center",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundColor,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});

export default CustomAlert;
