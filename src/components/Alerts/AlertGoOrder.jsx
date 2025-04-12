import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../theme/theme";
import StyledButton from "../../styles/StyledButton";
import AlertComponentGoOrder from "./AlertComponentGoOrder";

const AlertGoOrder = ({ order, isVisible }) => {
  const navigation = useNavigation();
  const starPointDestiny = order.starPointSeller;
  const stops = order.orders;
  //console.log(JSON.stringify(stops));

  const totalAmountProducts = stops.reduce((acc, order) => {
    acc[order.idDelivery] =
      (acc[order.idDelivery] || 0) +
      order.products.reduce((sum, product) => sum + product.unitPrice, 0);
    return acc;
  }, {});

  const onPressAcept = () => {
    navigation.navigate("MapOrderDeliveryScreen", {
      destinySeller: { starPointDestiny },
      context: "seller",
    });

    const ordersAndDeliveries = stops.map((stop) => ({
      idOrder: stop.idOrder,
      idDelivery: stop.idDelivery,
    }));

    // Actualizar el estado de delivery y orders
  };

  return (
    <View style={styles.container}>
      <Text style={styles.clientText}>{order.sellerName}</Text>

      <AlertComponentGoOrder
        orders={stops}
        totalAmountProducts={totalAmountProducts}
      />

      <Text style={styles.reminderText}>
        ¡Recuerda, una vez te dirijes a la finca ya haz aceptado el pedido!
      </Text>

      <StyledButton
        green
        style={styles.button}
        title={"Ir a la finca"}
        onPress={() => onPressAcept()}
      />

      <StyledButton
        red
        style={styles.button}
        title={"Cerrar"}
        onPress={() => isVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    width: "80%",
  },
  clientText: {
    color: theme.colors.greenText,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    elevation: 8,
    padding: 20,
    shadowRadius: 6,
    width: "93%",
  },
  reminderText: {
    color: theme.colors.black,
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default AlertGoOrder;
