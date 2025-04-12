import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../src/theme/theme";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const TimeAlert = ({ timeLeft, status, isStarted }) => {
  return (
    <View style={styles.alertView}>
      <Text style={styles.alertText}>
        {isStarted ? (
          status === "counting" ? (
            <>
              Tu pedido vencerá en
              <Text style={styles.timeRed}> {formatTime(timeLeft)}</Text>
            </>
          ) : status === "expired" ? (
            "El pedido ha vencido"
          ) : (
            "En espera..."
          )
        ) : (
          "En espera..."
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alertText: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  alertView: {
    backgroundColor: theme.colors.yellow,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  timeRed: {
    color: theme.colors.red,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimeAlert;
