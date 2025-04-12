import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../../theme/theme";
import { formatPrice } from "../../utils/constants";

const AlertComponentGoOrder = ({ orders, totalAmountProducts }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.stopsContainer}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.idDelivery.toString()}
        renderItem={({ item: order, index }) => (
          <View style={styles.orderCard} key={order.idDelivery}>
            <View style={styles.orderDetails}>
              <Text style={styles.orderTextBold}>
                Pedido {index + 1}:
                <Text style={styles.orderText}>
                  {" "}
                  Productos ( {order.products.length} ){" "}
                  {totalAmountProducts.length <= 0 &&
                    "/ $" + formatPrice(totalAmountProducts[order.idDelivery])}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DeliverOrderClient", {
                    orderClient: { order },
                    context: " ",
                  })
                }
              >
                <Text style={styles.viewLink}>Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        // ORD58C1
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={orders.length > 4 && { paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  stopsContainer: {
    marginBottom: 15,
    maxHeight: 300,
    width: "100%",
  },
  viewLink: {
    color: theme.colors.greenText,
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default AlertComponentGoOrder;
