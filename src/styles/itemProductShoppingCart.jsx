import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../theme/theme";
import StyledText from "./StyledText";

import { formatCurrency } from "../../funcions/formatPrice";
import { getFirstURLFromString } from "../../funcions/getUrlImages";

const ItemProductCartAdd = (props) => {
  const navigation = useNavigation();
  const { item, cart, onClick = () => {} } = props;

  function next() {
    var id;
    if (item.idProduct) {
      id = item.idProduct;
    } else {
      id = item.id_product;
    }
    navigation.navigate("DetailProduct", {
      idProduct: id,
    });
  }

  return (
    <View style={styles.gridItem}>
      {item.urlImage ? (
        <TouchableOpacity
          style={styles.imgPres}
          onPress={() => {
            next();
          }}
        >
          <Image
            source={{ uri: getFirstURLFromString(item.urlImage) }}
            style={styles.imageItem}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.imgPres}
          onPress={() => {
            next();
          }}
        >
          <Image
            source={require("../../assets/shopping.png")}
            style={styles.imageItem}
          />
        </TouchableOpacity>
      )}
      <View style={styles.containerItemInfo}>
        <StyledText bold lines={1} width="60%">
          {item.name}
        </StyledText>
        <StyledText bold lines={1} width="35%">
          x {item.measurementUnit}
        </StyledText>
      </View>
      <StyledText red bold lines={1}>
        {formatCurrency(item.price)}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  containerInfo: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
  },
  containerItemInfo: {
    flexDirection: "row",
    width: "100%",
  },
  containerStar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 60,
  },
  exit: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    left: 10,
    position: "absolute",
    top: 10,
    width: 30,
  },
  gridItem: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    height: 150,
    margin: 5,
    width: 150,
  },
  imageItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  imageStore: {
    height: "30%",
    resizeMode: "cover",
    width: "100%",
  },
  imgPres: {
    height: "60%",
    width: "100%",
  },
  send: {
    alignItems: "center",
    backgroundColor: theme.colors.greenLiht,
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    width: 50,
  },
});

export default ItemProductCartAdd;
