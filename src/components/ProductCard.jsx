import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import theme from "../../src/theme/theme";
import { findProductByID } from "../../services/productService";
import { formatPrice } from "../utils/constants";

const ProductCard = ({ item, index }) => {
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const fetchProductInfo = async () => {
      const product = await findProductByID(item.productId);
      setProductInfo(product);
    };

    fetchProductInfo();
  }, [item.productId]);

  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>
        {index}. {productInfo ? productInfo.name : "Cargando..."}
      </Text>
      <Text style={styles.productDetailText}>
        <FontAwesome
          name="shopping-cart"
          size={16}
          color={theme.colors.green}
        />
        {"  "}Cantidad: {item.quantity} {/* {productInfo.measurementUnit} */}
      </Text>
      <Text style={styles.productDetailText}>
        <FontAwesome name="tag" size={16} color={theme.colors.yellow} />
        {"  "}Precio: ${productInfo ? formatPrice(productInfo.price) : "N/A"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    alignItems: "center",
    marginVertical: 5,
  },
  // eslint-disable-next-line react-native/no-color-literals
  productDetailText: {
    color: "#555",
    fontSize: 18,
  },
  // eslint-disable-next-line react-native/no-color-literals
  productName: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProductCard;
