import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { formatPrice } from "../../src/utils/constants";
import TimeAlert from "../../src/styles/StyledTimeAlert";
import theme from "../../src/theme/theme";

const OrderItem = ({
  item,
  timeLeft,
  status,
  isStarted,
  onViewOrder,
  onCancelOrder,
  displayMode,
}) => {
  const shouldDisplay = (mode) =>
    !displayMode || displayMode === "both" || displayMode === mode;

  const totalToPay = item.products.reduce(
    (total, product) => total + product.unitPrice,
    0,
  );

  const totalProducts = item.products.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  return (
    <View style={styles.orderView}>
      <Text style={styles.titleText}>Pedido ID: ORD-{item.idDelivery}</Text>
      <OrderDetails
        item={item}
        totalToPay={totalToPay}
        totalProducts={totalProducts}
      />

      {shouldDisplay("time") && (
        <TimeAlert timeLeft={timeLeft} status={status} isStarted={isStarted} />
      )}

      <View style={styles.buttonContainer}>
        {shouldDisplay("view") && (
          <OrderButton
            title="Ver Pedido"
            onPress={() => onViewOrder(item)}
            style={styles.viewOrderButton}
          />
        )}
        {shouldDisplay("cancel") && (
          <OrderButton
            title="Cancelar Pedido"
            onPress={() => onCancelOrder(item.id)}
            style={styles.cancelOrderButton}
          />
        )}
      </View>
    </View>
  );
};

const OrderDetails = ({ item, totalToPay, totalProducts }) => (
  <>
    <Text style={styles.infoText}>
      Órdenes: <Text style={styles.boldText}>{item.products.length}</Text>
    </Text>
    <Text style={styles.infoText}>
      Catidad de productos: <Text style={styles.boldText}>{totalProducts}</Text>
    </Text>
    <Text style={styles.infoText}>
      Costo del envio:{" "}
      <Text style={styles.boldText}>${formatPrice(item.deliveryCost)}</Text>
    </Text>
    <Text style={styles.infoText}>
      <Text style={styles.boldTextRed}>- Subtotal: </Text>
      <Text style={styles.boldText}>
        ${formatPrice(totalToPay + item.deliveryCost)}
      </Text>
    </Text>
  </>
);

const OrderButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  boldText: {
    color: theme.colors.textPrimary,
    fontWeight: "bold",
  },
  boldTextRed: {
    color: theme.colors.red,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelOrderButton: {
    alignItems: "center",
    backgroundColor: theme.colors.red,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginVertical: 2,
  },
  orderView: {
    alignSelf: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.red,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    width: "95%",
  },
  titleText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  viewOrderButton: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default OrderItem;
