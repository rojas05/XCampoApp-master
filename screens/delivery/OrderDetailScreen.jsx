import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useRoutes } from "../delivery/context/RoutesContext";
import { updateStateDeliveryProducts } from "../../services/DeliveryProduct";

import Header from "../../src/components/HeaderCustomer";
import OrderInfo from "../../src/components/OrderComponents/OrderInfo";
import OrderTotals from "../../src/components/OrderComponents/OrderTotals";
import PaymentSwitch from "../../src/components/PaymentSwitch";

import StyledButton from "../../src/styles/StyledButton";
import theme from "../../src/theme/theme";

const OrderDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { markRouteAsCompleted } = useRoutes();
  const { order, context } = route.params || {};
  const [isPaid, setIsPaid] = useState(false);
  const ordersList = order || [];

  useEffect(() => {
    const handleBackPress = () => {
      Alert.alert(
        "Acción no permitida",
        "No se puede regresar, ya que esto comprometería los datos.",
        [{ text: "OK" }],
      );
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  const { totalCostOrder, totalCost, totalProducts, totalDeliveryCost } =
    ordersList.reduce(
      (acc, order) => {
        const orderTotal = order.products.reduce(
          (sum, product) => sum + product.unitPrice,
          0,
        );
        acc.totalCostOrder.push(orderTotal);
        acc.totalCost += orderTotal;
        acc.totalProducts += order.products.length;
        acc.totalDeliveryCost += order.deliveryCost;
        return acc;
      },
      {
        totalCostOrder: [],
        totalCost: 0,
        totalProducts: 0,
        totalDeliveryCost: 0,
      },
    );

  const handleBackPress = () => {
    if (context === "MapOrderDeliveryScreen") {
      Alert.alert(
        "Acción no permitida",
        "No se puede regresar, ya que esto comprometería los datos.",
        [{ text: "OK" }],
      );
      return;
    }
    navigation.goBack();
  };

  const handleAcceptOrder = async () => {
    if (!isPaid) {
      Alert.alert("Pago pendiente", "No se ha pagado la orden.", [
        { text: "OK" },
      ]);
      return;
    }

    const destinyClientsStack = ordersList
      .filter((element) => element.destinyClient)
      .map((element) => element.destinyClient);

    if (context === "deliveredNotification") {
      markRouteAsCompleted(ordersList);
      handleBackPress();
    } else {
      navigation.navigate("MapOrderDeliveryScreen", {
        destinyClients: destinyClientsStack,
        context: "client",
        orders: ordersList,
      });
    }

    try {
      await Promise.all(
        ordersList.map((stop) =>
          updateStateDeliveryProducts(stop.idDelivery, "RECOGIDO"),
        ),
      );
    } catch (error) {
      console.error("Error al actualizar el estado de las órdenes:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={order.sellerName || "Detalle del pedido"}
        onBackPress={handleBackPress}
      />
      <FlatList
        data={ordersList}
        keyExtractor={(item) => item.idOrder.toString()}
        renderItem={({ item, index }) => (
          <OrderInfo order={item} totalCost={totalCostOrder[index]} />
        )}
      />
      <View style={styles.footerContainer}>
        <OrderTotals
          totalProducts={totalProducts}
          totalCost={totalCost}
          totalToPay={totalCost + totalDeliveryCost}
        />
        {!isPaid && (
          <Text style={styles.warningText}>No se ha pagado la orden</Text>
        )}
        <PaymentSwitch isPaid={isPaid} setIsPaid={setIsPaid} />
        <StyledButton
          green
          title="Aceptar pedido"
          onPress={handleAcceptOrder}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.whiteMedium,
    flex: 1,
    padding: 15,
  },
  footerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  warningText: {
    color: theme.colors.red,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
});

export default OrderDetailScreen;
