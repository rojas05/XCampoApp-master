import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Xmark } from "iconoir-react-native";
import PagerView from "react-native-pager-view";
import Constants from "expo-constants";

import StyledText from "../../src/styles/StyledText";
import StyledButton from "../../src/styles/StyledButton";
import theme from "../../src/theme/theme";
import string from "../../src/string/string";

import API_URL from "../../fetch/ApiConfig";
import { formatCurrency } from "../../funcions/formatPrice";
import { fetchWithToken, getToken } from "../../tokenStorage";
import { getOtherURLsFromString } from "../../fetch/UseFetch";
import QuantitySelector from "../../src/components/QuantitySelector";

const DetailProduct = () => {
  const route = useRoute();
  const { idProduct } = route.params;

  const [product, setProduct] = useState({});
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [idCart, setIdCart] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDataAPI = useCallback(async (url, setDate) => {
    try {
      const response = await fetchWithToken(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setDate(data);

        if (data.UrlImage != null)
          setImgs(getOtherURLsFromString(data.UrlImage));

        setLoading(false);
      } else {
        setDate(null);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function addProductCart() {
    try {
      const requestBody = {
        cardId: idCart,
        productId: idProduct,
        quantity: quantity,
        unitPrice: product.price,
      };

      console.log(requestBody);
      const response = await fetchWithToken(`${API_URL}cartItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigation.replace("Cart", {
          idCart: idCart,
        });
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getData() {
    const idUser = await getToken("id");
    getDataAPI(`${API_URL}products/${idProduct}`, setProduct);
    getDataAPI(`${API_URL}ShoppingCart/id/${idUser}`, setIdCart);
  }

  return (
    <View style={styles.container}>
      {product?.UrlImage ? (
        <PagerView style={styles.pager}>
          <View style={styles.ImageContainer}>
            <Image style={styles.image} source={{ uri: imgs[0] }} />
            <View style={styles.imageIndexContainer}>
              <View style={styles.imageIndexA}></View>
              <View style={styles.imageIndexB}></View>
            </View>
          </View>

          <View style={styles.ImageContainer}>
            <Image style={styles.image} source={{ uri: imgs[1] }} />
            <View style={styles.imageIndexContainer}>
              <View style={styles.imageIndexB}></View>
              <View style={styles.imageIndexA}></View>
            </View>
          </View>
        </PagerView>
      ) : (
        <PagerView style={styles.pager}>
          <View style={styles.ImageContainer}>
            <Image
              style={styles.image}
              source={require("../../assets/backgroundXcampo.png")}
            />
            <View style={styles.imageIndexContainer}>
              <View style={styles.imageIndexA}></View>
              <View style={styles.imageIndexB}></View>
            </View>
          </View>

          <View style={styles.ImageContainer}>
            <Image
              style={styles.image}
              source={require("../../assets/XCampo.png")}
            />
            <View style={styles.imageIndexContainer}>
              <View style={styles.imageIndexB}></View>
              <View style={styles.imageIndexA}></View>
            </View>
          </View>
        </PagerView>
      )}

      {loading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
        <View>
          <View style={styles.containerInfo}>
            <StyledText title bold>
              {product?.name}
            </StyledText>

            <StyledText title bold paddingBottom={10}>
              {product?.measurementUnit} por {formatCurrency(product?.price)}
            </StyledText>

            <StyledText paddingBottom={10}>
              Quedan {product?.stock} Unidades disponibles
            </StyledText>

            <StyledText>{product?.description}</StyledText>
          </View>
        </View>
      )}
      <View style={styles.containerProduct}>
        <QuantitySelector
          initialQuantity={1}
          onChange={(value) => setQuantity(value)}
        />

        <StyledButton
          title={string.client.add}
          padding={10}
          onPress={addProductCart}
        ></StyledButton>
      </View>

      <TouchableOpacity
        style={styles.exit}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Xmark width={30} height={30} color={"black"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: 290,
    position: "relative",
  },
  addCart: {
    alignItems: "center",
    flexDirection: "row",
    width: 200,
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    marginTop: Constants.statusBarHeight,
  },
  containerInfo: {
    backgroundColor: theme.colors.greenLiht,
    borderRadius: 10,
    justifyContent: "center",
    margin: "2%",
    padding: 10,
  },
  containerProduct: {
    alignItems: "center",
    backgroundColor: theme.colors.greenLiht,
    borderBottomEndRadius: 80,
    borderTopEndRadius: 80,
    borderTopStartRadius: 80,
    bottom: 2,
    margin: "2%",
    padding: 40,
  },
  exit: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    left: "3%",
    padding: 5,
    position: "absolute",
    top: "5%",
  },
  image: {
    borderRadius: 10,
    height: "100%",
    margin: "2%",
    resizeMode: "cover",
    width: "96%",
  },
  imageIndexA: {
    backgroundColor: theme.colors.green,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  imageIndexB: {
    backgroundColor: theme.colors.greenMedium,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  imageIndexContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    borderRadius: 20,
    bottom: 10,
    flexDirection: "row",
    height: 20,
    justifyContent: "space-around",
    position: "absolute",
    right: "45%",
    width: 40,
  },
  pager: {
    height: 300,
    width: "100%",
  },
});

export default DetailProduct;
