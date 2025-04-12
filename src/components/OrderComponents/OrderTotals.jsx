import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { formatPrice } from "../../utils/constants";

const OrderTotals = ({ totalProducts, totalCost, totalToPay }) => (
  <View style={styles.totals}>
    <TotalRow
      icon="shopping-bag"
      label={`Total de productos Seleccionados: ${totalProducts || 0}`}
    />
    <TotalRow icon="money" label={`Costo Total: $${formatPrice(totalCost)}`} />
    <TotalRow
      icon="truck"
      label={`Total a Pagar (incluye envío): $${formatPrice(totalToPay)}`}
    />
  </View>
);

const TotalRow = ({ icon, label }) => (
  <View style={styles.row}>
    <FontAwesome name={icon} size={20} color="#333" />
    <Text style={styles.totalText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  totalText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  totals: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

export default OrderTotals;
