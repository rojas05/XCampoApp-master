import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import theme from "../theme/theme";

const NoDataView = ({ dataText }) => (
  <View style={styles.noOrdersContainer}>
    <Ionicons
      name="document-text-outline"
      size={80}
      color={theme.colors.gray}
    />
    <Text style={styles.noOrdersText}>No hay {dataText} disponibles</Text>
    <Text style={styles.noOrdersSubtext}>
      Las nuevas {dataText} aparecerán aquí
    </Text>
  </View>
);

const styles = StyleSheet.create({
  noOrdersContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  noOrdersSubtext: {
    color: theme.colors.gray,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  noOrdersText: {
    color: theme.colors.gray,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default NoDataView;
