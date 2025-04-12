import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native"; // No se usa image
import theme from "../theme/theme";
import { formatCurrency } from "../../funcions/formatPrice";
import { useNavigation } from "@react-navigation/native";
import StyledText from "../styles/StyledText";
import { Search } from "iconoir-react-native";

const ItemProductSearch = (props) => {
  const navigation = useNavigation();
  const { item } = props;

  function next() {
    navigation.navigate("DetailProduct", {
      idProduct: item.id_product,
    });
  }

  return (
    <TouchableOpacity
      onPress={() => {
        next();
      }}
    >
      <View style={styles.containerItemInfo}>
        <Search color={"black"} width={25} height={25} />
        <StyledText title lines={1} width="60%">
          {item.name}
        </StyledText>
        <StyledText title lines={1} width="35%">
          por {item.measurementUnit.toLowerCase()}
        </StyledText>
        <StyledText title lines={1} width="35%">
          a tan solo {formatCurrency(item.price)}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerItemInfo: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    flexDirection: "row",
    marginStart: "5%",
    marginTop: "2%",
    padding: 5,
    width: "90%",
  },
});

export default ItemProductSearch;
