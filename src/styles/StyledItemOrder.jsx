import React from "react";
import { DeliveryTruck, DoubleCheck, HomeAlt } from "iconoir-react-native";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import StyledText from "./StyledText";
import theme from "../theme/theme";

const StyledItemOrder = ({ item }) => {
  const navigation = useNavigation();

  console.log("[StyledItemOrder] item: " + item);

  let store = styles.colorN;
  let delivery = styles.colorN;
  let home = styles.colorN;
  let color = styles.circleB;

  if ((item.state !== "LISTA_ENVIAR") & (item.state !== "FINALIZADA")) {
    store = styles.color;
    color = styles.circleR;
  }

  if (item.state === "LISTA_ENVIAR") {
    store = styles.color;
    delivery = styles.color;
    color = styles.circleB;
  }

  if (item.state === "FINALIZADA") {
    home = styles.color;
    store = styles.color;
    delivery = styles.color;
    color = styles.circleG;
  }

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          navigation.replace("OrderDetailClient", {
            id: item.idOrder,
            state: item.state,
          });
        }}
      >
        <View style={color}></View>
        <StyledText bold title>
          N.O {item.idOrder}
        </StyledText>

        <Text>Fecha</Text>

        <StyledText bold title>
          {item.date}
        </StyledText>

        <StyledText>Estado</StyledText>

        <View style={styles.containerState}>
          <View style={styles.stateItem}>
            <HomeAlt width={30} height={30} color={"black"} />
            <View style={store}></View>
          </View>

          <View style={styles.stateItem}>
            <DeliveryTruck width={30} height={30} color={"black"} />
            <View style={delivery}></View>
          </View>

          <View style={styles.stateItem}>
            <DoubleCheck width={30} height={30} color={"black"} />
            <View style={home}></View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  circleB: {
    backgroundColor: theme.colors.blue,
    borderRadius: 8,
    borderWidth: 1,
    height: 15,
    position: "absolute",
    right: 2,
    top: 2,
    width: 15,
  },
  circleG: {
    backgroundColor: theme.colors.green,
    borderRadius: 8,
    borderWidth: 1,
    height: 15,
    position: "absolute",
    right: 2,
    top: 2,
    width: 15,
  },
  circleR: {
    backgroundColor: theme.colors.red,
    borderRadius: 8,
    borderWidth: 1,
    height: 15,
    position: "absolute",
    right: 2,
    top: 2,
    width: 15,
  },
  color: {
    backgroundColor: theme.colors.green,
    borderTopColor: theme.colors.grey,
    borderTopWidth: 1,
    height: 8,
    width: 38,
  },
  colorN: {
    backgroundColor: theme.colors.greenOpacity,
    borderTopColor: theme.colors.grey,
    borderTopWidth: 1,
    height: 8,
    width: 38,
  },
  containerState: {
    flexDirection: "row",
  },
  item: {
    alignItems: "center",
    borderColor: theme.colors.grey,
    borderRadius: 10,
    borderWidth: 1,
    height: 180,
    margin: 5,
    padding: 15,
    width: 150,
  },
  stateItem: {
    alignItems: "center",
    borderColor: theme.colors.grey,
    borderWidth: 1,
    height: 40,
    width: 40,
  },
});

export default StyledItemOrder;
