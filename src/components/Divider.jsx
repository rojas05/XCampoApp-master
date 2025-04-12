import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  divider: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginVertical: 5,
    width: "100%",
  },
});

export default Divider;
