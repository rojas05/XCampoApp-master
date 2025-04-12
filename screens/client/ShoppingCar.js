import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { LabelSolid } from "iconoir-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import theme from "../../src/theme/theme";
import string from "../../src/string/string";
import StyledText from "../../src/styles/StyledText";
import StyledButton from "../../src/styles/StyledButton";
import StyledItemProductCart from "../../src/styles/styledItemProductCar";
import ItemProductCartAdd from "../../src/styles/itemProductShoppingCart";

import API_URL from "../../fetch/ApiConfig";
import { fetchWithToken } from "../../tokenStorage";
import { dateTimeFormat } from "../../funcions/date";
import { formatCurrency } from "../../funcions/formatPrice";
import { getSavedLocation } from "../../funcions/getCoordinates";

const ShoppingCart = () => {
  const route = useRoute();
  const { idCart, city, idClient } = route.params;

  const [product, setProduct] = useState();
  const [cart, setCart] = useState([]);
  const [item, setItem] = useState([]);
  const [price, setPrice] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (!idCart) {
      console.error("ID del carrito no está definido");
      return;
    }

    getDataAPI(`${API_URL}cartItem/all/${idCart}`, setCart);
    console.log(city);
    getPriceDomicilio();
    getDataAPI(
      `${API_URL}products/search?letter=${getRandomLetter()}&city=${city}`,
      setProduct,
    );
  }, []);

  function getRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Puedes agregar minúsculas si lo necesitas
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }

  const getDataAPI = useCallback(async (url, setDate) => {
    try {
      const response = await fetchWithToken(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setDate(data);
        //setLoading(false)
      } else {
        setDate(null);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function getPriceDomicilio() {
    try {
      const savedLocation = await getSavedLocation();
      const requestBody = {
        destination: savedLocation,
      };
      const response = await fetchWithToken(`${API_URL}tarifa/${idCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPrice(data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await fetchWithToken(`${API_URL}cartItem/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        getDataAPI(`${API_URL}cartItem/all/${idCart}`, setCart);
      } else {
        console.log(response.body);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateQuantityItem(value, id) {
    try {
      const response = await fetchWithToken(
        `${API_URL}cartItem/${id}/${value}`,
        {
          method: "PUT",
        },
      );
      if (response.ok) {
        getDataAPI(`${API_URL}cartItem/all/${idCart}`, setCart);
      } else {
        console.log(response.body);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createOrder() {
    if (!idCart) {
      console.error("ID del carrito no está definido");
      return;
    }

    try {
      const requestBody = {
        state: "EN_ESPERA",
        message: "null",
        delivery: true,
        priceDelivery: price,
        shoppingCartId: {
          idCart: idCart,
        },
      };
      console.log(requestBody);

      const response = await fetchWithToken(`${API_URL}order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        navigation.goBack();
      } else {
        console.warn("[createOrder] " + response);
      }
    } catch (error) {
      console.error("[createOrder] error: " + error);
    }
  }

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
        console.warn("Error en post carrito: " + response);
      }
    } catch (error) {
      console.error("Error en post carrito: " + error);
    }
  }, []);

  async function createCart() {
    const requestBodyCart = {
      clientId: idClient, // Error
      dateAdded: dateTimeFormat(),
    };
    postDataAPI(`${API_URL}ShoppingCart/add`, requestBodyCart, setCart);
  }

  async function addProductCart(item) {
    const requestBody = {
      cardId: cart.id_cart,
      productId: item.idProduct,
      quantity: 1,
      unitPrice: item.price,
    };
    postDataAPI(`${API_URL}cartItem`, requestBody, setItem); // Error
    createCart();
  }

  const calcularTotal = (productos) => {
    return productos.reduce(
      (total, item) => total + item.itemQuantity * item.productPrice,
      0,
    );
  };

  const renderItemP = ({ item }) => (
    <ItemProductCartAdd
      item={item}
      onClick={() => {
        addProductCart(item);
      }}
    ></ItemProductCartAdd>
  );

  const renderItemC = ({ item }) => (
    <StyledItemProductCart
      item={item}
      onDelete={(id) => {
        deleteItem(id);
      }}
      update={(value) => {
        updateQuantityItem(value, item.idCartItem);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerCar}>
        <StyledText title bold>
          Carrito{" "}
        </StyledText>

        {cart ? (
          <FlatList
            data={cart}
            renderItem={renderItemC}
            keyExtractor={(item) => item.idCartItem.toString()}
            columnWrapperStyle={styles.columnWrapper} // Espaciado entre columnas
            width="100%"
          />
        ) : (
          <ActivityIndicator></ActivityIndicator>
        )}
      </View>

      <View style={styles.products}>
        <StyledText title bold marginTop={15}>
          {string.client.addCart}
        </StyledText>

        <FlatList
          data={product}
          renderItem={renderItemP}
          keyExtractor={(item) => item.idProduct}
          columnWrapperStyle={styles.columnWrapper} // Espaciado entre columnas
          width="95%"
          horizontal
        />
      </View>

      <View style={styles.total}>
        <View style={styles.info}>
          <StyledText bold>{string.client.summaey}</StyledText>
          <Text>{string.client.AddCode}</Text>
        </View>
        <View style={styles.info} borderTopWidth={0}>
          <LabelSolid width={20} height={20} color={"black"} />
          <StyledText>{string.client.codes}</StyledText>
          <TextInput placeholder="Aplicar" style={styles.imput}></TextInput>
        </View>
        <View style={styles.infoT}>
          <StyledText>{string.client.subtotal}</StyledText>
          <StyledText>{formatCurrency(calcularTotal(cart))}</StyledText>
        </View>
        <View style={styles.infoT}>
          <StyledText>{string.client.delivery}</StyledText>
          {price ? (
            <StyledText>{formatCurrency(price)}</StyledText>
          ) : (
            <StyledText>calculando...</StyledText>
          )}
        </View>
        <View style={styles.infoT}>
          <StyledText bold>{string.client.total}</StyledText>
          <StyledText green bold>
            {formatCurrency(calcularTotal(cart) + price)}
          </StyledText>
        </View>

        <StyledText green bold title>
          {string.client.cash} {formatCurrency(calcularTotal(cart) + price)}
        </StyledText>
        <Text width={"80%"}>{string.client.message}</Text>

        <StyledButton
          title={string.client.pay}
          padding={10}
          red
          width={"80%"}
          onPress={() => {
            createOrder();
          }}
        ></StyledButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonAdd: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderColor: theme.colors.greyMedium,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 2,
    position: "absolute",
    start: "30%",
    top: "32%",
    width: "70%",
  },
  container: {
    marginTop: Constants.statusBarHeight,
  },
  containerCar: {
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    height: "40%",
    marginStart: "5%",
    width: "90%",
  },
  imput: {
    borderBlockColor: theme.colors.grey,
    borderRadius: 10,
    borderWidth: 1,
    width: 100,
  },
  info: {
    alignItems: "center",
    borderBlockColor: theme.colors.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    width: "90%",
  },
  infoT: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    width: "80%",
  },
  products: {
    height: "25%",
  },
  total: {
    alignItems: "center",
    height: "30%",
  },
});

export default ShoppingCart;
