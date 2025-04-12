import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../theme/theme";
import StyledButton from "../../styles/StyledButton";
import { formatPrice, GET_COLOR_RUTE } from "../../utils/constants";

const AlertComponentOrderClient = ({ orders, onPress }) => {
  const { totalCostOrder, totalCost } = orders.reduce(
    (acc, order) => {
      const orderTotal = order.products.reduce(
        (sum, product) => sum + product.unitPrice,
        0,
      );
      acc.totalCostOrder.push(orderTotal);
      acc.totalCost += orderTotal;
      return acc;
    },
    {
      totalCostOrder: [],
      totalCost: 0,
    },
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Tienes {orders.length} pedidos por entregar
      </Text>
      <Text style={styles.header}>({orders.length} paradas)</Text>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total pedidos a Cobrar ${formatPrice(totalCost)}
        </Text>
      </View>

      {orders.map((order, index) => (
        <View key={index} style={styles.stopContainer}>
          <View
            style={[styles.circle, { backgroundColor: GET_COLOR_RUTE(index) }]}
          />
          <View style={styles.textContainer}>
            <Text style={styles.stopTitle}>
              Parada {index + 1}: {order.userName}
            </Text>
            <Text style={styles.stopDetails}>
              - Cobras $ {formatPrice(totalCostOrder[index])} /{" "}
              {order.products.length} productos
            </Text>
          </View>
        </View>
      ))}

      <StyledButton green title="Iniciar entrega" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderRadius: 6,
    height: 12,
    marginRight: 8,
    marginTop: 4,
    width: 12,
  },
  container: {
    backgroundColor: theme.colors.whiteMedium,
    borderColor: theme.colors.backgroundColor,
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    borderWidth: 1,
    elevation: 10,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  stopContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 15,
  },
  stopDetails: {
    fontSize: 18,
    marginLeft: 5,
  },
  stopTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  totalContainer: {
    backgroundColor: theme.colors.grey,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  totalText: {
    color: theme.colors.red,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AlertComponentOrderClient;
