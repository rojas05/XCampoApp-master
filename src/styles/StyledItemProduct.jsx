import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heart } from "iconoir-react-native";

import theme from "../theme/theme";
import StyledText from "./StyledText";
import { getFirstURLFromString } from "../../fetch/UseFetch";

const StyledItemProduct = ({ store, item, idClient }) => {
  const navigation = useNavigation();
  const imageStyles = [styles.image, store && styles.imageStore];
  const containerStyles = [styles.container, store && styles.containerStore];

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DetailStore", {
          idStore: item.id_seller,
          idClient: idClient,
        });
      }}
    >
      <View style={containerStyles}>
        {item.img ? (
          <Image
            source={{ uri: getFirstURLFromString(item.img) }}
            style={imageStyles}
          />
        ) : (
          <Image
            source={require("../../assets/store.png")}
            style={imageStyles}
          />
        )}

        <View style={styles.containerText}>
          <StyledText bold>{item.name_store}</StyledText>
          <Heart width={20} height={20} color={"black"} style={styles.icon} />
        </View>

        <StyledText>{item.location}</StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.greenOpacity,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    height: 160,
    margin: 5,
    paddingBottom: 5,
    width: 150,
  },
  containerStore: {
    backgroundColor: theme.colors.greenOpacity,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    height: 240,
    margin: 5,
    paddingBottom: 5,
    width: "96%",
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
    backgroundColor: theme.colors.yellow,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 100,
    width: "100%",
  },
  imageStore: {
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 180,
    width: "100%",
  },
});

export default StyledItemProduct;
