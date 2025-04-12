import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { formatPrice } from "../../utils/constants";
import ProductCard from "../ProductCard";
import Divider from "../Divider";
import theme from "../../theme/theme";

const OrderInfo = ({ order, totalCost }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoTitle}>Pedido No. {order.idOrder}</Text>
    <Text style={styles.orderId}>{order.products.length} Productos</Text>
    <Divider />
    {order.products.map((product, index) => (
      <ProductCard key={index} item={product} index={index + 1} />
    ))}
    <Divider />
    <Text style={styles.orderId}>
      Costo del envio: ${formatPrice(order.deliveryCost)}
    </Text>
    <Text style={styles.orderId}>Total: ${formatPrice(totalCost)}</Text>
  </View>
);

const styles = StyleSheet.create({
  infoContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 8,
    padding: 15,
  },
  // eslint-disable-next-line react-native/no-color-literals
  infoTitle: {
    color: "#333",
    fontSize: 22,
    fontWeight: "bold",
  },
  orderId: {
    fontSize: 20,
    marginTop: 8,
  },
});

export default OrderInfo;
