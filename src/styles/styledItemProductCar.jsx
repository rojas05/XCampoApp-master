import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import theme from "../theme/theme";
import StyledText from "./StyledText";
import QuantitySelector from "../components/QuantitySelector";

import { formatCurrency } from "../../funcions/formatPrice";
import { getFirstURLFromString } from "../../funcions/getUrlImages";

const StyledItemProductCart = (props) => {
  const { item, onDelete, update, order } = props;
  const imageStyles = [styles.image];
  const navigation = useNavigation();
  function next() {
    navigation.navigate("DetailProduct", {
      idProduct: item.idProduct,
    });
  }

  return (
    <View style={styles.container}>
      {item.img ? (
        <TouchableOpacity
          style={styles.imgPres}
          onPress={() => {
            next();
          }}
        >
          <Image
            source={{ uri: getFirstURLFromString(item.img) }}
            style={styles.image}
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
            style={styles.image}
          />
        </TouchableOpacity>
      )}
      <View>
        <StyledText bold lines={1} width={150} marginBottom={5}>
          {item.productName}
        </StyledText>
        <View>
          <StyledText red bold lines={1} width={75}>
            {formatCurrency(item.productPrice)}
          </StyledText>
        </View>
      </View>
      {order ? (
        <StyledText title bold green>
          {item.itemQuantity}
        </StyledText>
      ) : (
        <QuantitySelector
          initialQuantity={item.itemQuantity}
          onChange={(value) => update(value)}
          onDelete={() => {
            onDelete(item.idCartItem);
          }}
          cart={true}
          maxQuantity={item.productStock}
        ></QuantitySelector>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.colors.grey,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    width: 320,
  },
  containerText: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  icon: {
    marginEnd: 5,
  },
  image: {
    height: 80,
    marginEnd: 10,
    width: 80,
  },
});

export default StyledItemProductCart;
