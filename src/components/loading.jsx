import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import theme from "../theme/theme";

const LoadingView = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.black} />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    zIndex: 10,
  },
  loadingText: {
    color: theme.colors.black,
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoadingView;
