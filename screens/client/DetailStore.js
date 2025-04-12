import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InfoCircle, StarSolid, Xmark } from "iconoir-react-native";

// import { YellowBox } from "react-native-web";
import API_URL from "../../fetch/ApiConfig";
import { fetchWithToken } from "../../tokenStorage";
import { dateTimeFormat } from "../../funcions/date";
import { getFirstURLFromString } from "../../funcions/getUrlImages";

import theme from "../../src/theme/theme";
import StyledText from "../../src/styles/StyledText";
import StyledItemProductStore from "../../src/styles/StyledItemProductStore";
// import { getCoordinates } from "../../funcions/getCoordinates";

const DetailStore = () => {
  const route = useRoute();

  const { idStore } = route.params;
  const { idClient } = route.params;

  const [store, setStore] = useState({});
  const [storeProducts, setProductsStore] = useState([]);
  const [item, setItem] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    createCart();
    getDataAPI(`${API_URL}seller/${idStore}`, setStore);
    getDataAPI(`${API_URL}products/listAll/${idStore}`, setProductsStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDataAPI = useCallback(async (url, setDate) => {
    try {
      const response = await fetchWithToken(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setDate(data);
        setLoading(false);
      } else {
        setDate(null);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const postDataAPI = useCallback(async (url, requestBody, setData) => {
    try {
      const response = await fetchWithToken(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function createCart() {
    const requestBodyCart = {
      clientId: idClient,
      dateAdded: dateTimeFormat(),
    };
    console.log(requestBodyCart);
    postDataAPI(`${API_URL}ShoppingCart/add`, requestBodyCart, setCart);
  }

  async function addProductCart(item) {
    const requestBody = {
      cardId: cart.id_cart,
      productId: item.idProduct,
      quantity: 1,
      unitPrice: item.price,
    };
    postDataAPI(`${API_URL}cartItem`, requestBody, setItem);
    createCart();
  }

  const renderItem = ({ item }) => (
    <StyledItemProductStore
      item={item}
      cart={cart.id_cart}
      onClick={() => {
        addProductCart(item);
      }}
    ></StyledItemProductStore>
  );

  return (
    <View style={styles.container}>
      {store.img ? (
        <Image
          source={{ uri: getFirstURLFromString(store.img) }}
          style={styles.imageStore}
        />
      ) : (
        <Image
          source={require("../../assets/store.png")}
          style={styles.imageStore}
        />
      )}

      <View style={styles.containerInfo}>
        {loading ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <View>
            <StyledText title bold>
              {store.name_store}
            </StyledText>
            <View style={styles.containerStar}>
              <StyledText>4.0</StyledText>
              <StarSolid width={20} height={20} color={"black"} />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.send}
          onPress={() => {
            navigation.replace("InfoStore", {
              idStore: store.id_seller,
            });
          }}
        >
          <InfoCircle width={20} height={20} color={"black"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={storeProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.idProduct}
        numColumns={2} // Especifica el número de columnas
        columnWrapperStyle={styles.columnWrapper} // Espaciado entre columnas
        width="95%"
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.replace("Cart", {
            idCart: cart.id_cart,
          });
        }}
      >
        <StyledText whiteButton bold>
          Ver carrito ({cart.items})
        </StyledText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.exit}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Xmark width={20} height={20} color={"black"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between", // Espaciado uniforme entre columnas
    marginBottom: 10, // Espaciado vertical entre filas
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.greenOpacity,
    flex: 1,
    marginTop: Constants.statusBarHeight,
    position: "relative",
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
  fab: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 10,
    bottom: 20,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: "25%",
    width: "50%",
  },
  gridItem: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    height: 200,
    margin: 5,
    width: 150,
  },
  imageItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "50%",
    resizeMode: "cover",
    width: "100%",
  },
  imageStore: {
    backgroundColor: theme.colors.yellow,
    height: "30%",
    resizeMode: "cover",
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

export default DetailStore;
