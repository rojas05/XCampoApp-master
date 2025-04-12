import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { updateStateDeliveryProducts } from "../../../services/DeliveryProduct";

import theme from "../../theme/theme";
import { formatPrice } from "../../utils/constants";
import StyledButton from "../../styles/StyledButton";

const AlertGoDestinyClient = ({ orders, isVisible, index }) => {
  const navigation = useNavigation();
  const order = orders[index];
  //console.log("Orders Clients: XD " + JSON.stringify(order));

  const calculateTotalCost = () =>
    order.products.reduce((total, product) => total + product.unitPrice, 0);

  const toggleVisibility = async () => {
    console.log("Actualizando en caminio");
    await updateStateDeliveryProducts(order.idDelivery, "EN_CAMINO");

    isVisible(false);
  };

  const showInfoDelivery = () => {
    navigation.navigate("DeliverOrderClient", {
      orderClient: { order },
      context: "rute",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.clientText}>Cliente {order.userName}</Text>
      <Text style={styles.orderTitle}>Pedido No: ORD-{order.idDelivery}</Text>

      <View style={styles.stopsContainer}>
        <View style={styles.orderCard} key={order.idDelivery}>
          <View style={styles.orderDetails}>
            <Text style={styles.orderTextBold}>
              Pedido {index + 1}:
              <Text style={styles.orderText}>
                {" "}
                Productos {order.products.length}
              </Text>
            </Text>
            <TouchableOpacity onPress={() => showInfoDelivery()}>
              <Text style={styles.viewLink}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.amountText}>
        Cobrar ${formatPrice(calculateTotalCost())}
      </Text>
      <Text style={styles.reminderText}>
        ¡Recuerda entregar el pedido correcto al cliente!
      </Text>

      <StyledButton
        green
        style={styles.button}
        title={"Vamos"}
        onPress={toggleVisibility}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  amountText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
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
  orderCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    elevation: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: theme.colors.greyMedium,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderDetails: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderText: {
    color: theme.colors.black,
    fontSize: 20,
    fontWeight: "normal",
  },
  orderTextBold: {
    color: theme.colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  orderTitle: {
    color: theme.colors.green,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  reminderText: {
    color: theme.colors.black,
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  stopsContainer: {
    marginBottom: 15,
    width: "100%",
  },
  viewLink: {
    color: theme.colors.greenText,
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default AlertGoDestinyClient;
