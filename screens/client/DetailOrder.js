import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import {
  DeliveryTruck,
  DoubleCheck,
  HomeAlt,
  SendDiagonal,
  Xmark,
} from "iconoir-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import theme from "../../src/theme/theme";
import StyledText from "../../src/styles/StyledText";
import StyledItemProductCart from "../../src/styles/styledItemProductCar";

import { fetchWithToken } from "../../tokenStorage";
import API_URL from "../../fetch/ApiConfig";

const DetailOrder = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { id, state } = route.params;
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrderData = async () => {
      setLoading(true);
      try {
        const orderResponse = await getDataAPI(`${API_URL}order/getId/${id}`);
        setOrder(orderResponse);

        if (orderResponse?.shoppingCartId?.idCart) {
          const cartResponse = await getDataAPI(
            `${API_URL}cartItem/all/${orderResponse.shoppingCartId.idCart}`,
          );
          setCart(cartResponse || []);
        }
      } catch (err) {
        console.error("[getOrderData] Error:", err);
        setError(err.message || "Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    getOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDataAPI = useCallback(async (url) => {
    try {
      const response = await fetchWithToken(url, { method: "GET" });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("[getDataAPI] Error:", error);
      throw error;
    }
  }, []);

  const getStatusStyles = useMemo(() => {
    const baseStyle = styles.colorN;
    const activeStyle = styles.color;

    return {
      store: [
        baseStyle,
        state !== "LISTA_ENVIAR" && state !== "FINALIZADA" && activeStyle,
      ],
      delivery: [
        baseStyle,
        (state === "LISTA_ENVIAR" || state === "FINALIZADA") && activeStyle,
      ],
      home: [baseStyle, state === "FINALIZADA" && activeStyle],
    };
  }, [state]);

  const renderItemC = ({ item }) => (
    <StyledItemProductCart item={item} order></StyledItemProductCart>
  );

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
      {error && <StyledText error>{error}</StyledText>}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Xmark width={30} height={30} color={"black"} />
        </TouchableOpacity>
        <StyledText title bold>
          N.O: {`ORD-${order?.idOrder}` || "Cargando..."}
        </StyledText>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChatScreen", {
              idOrder: order.idOrder,
              senderId: order.shoppingCartId.clientId,
              senderContext: "CLIENT",
              orderStatus: order.state,
            })
          }
        >
          <SendDiagonal width={30} height={30} color={"black"} />
        </TouchableOpacity>
      </View>

      {order && (
        <>
          <StyledText title bold>
            Estado de la orden: {state}
          </StyledText>

          <View style={styles.containerState}>
            <View style={styles.stateItem}>
              <DoubleCheck width={40} height={40} color={"black"} />
              <View style={getStatusStyles.store}></View>
            </View>

            <View style={styles.stateItem}>
              <DeliveryTruck width={40} height={40} color={"black"} />
              <View style={getStatusStyles.delivery}></View>
            </View>

            <View style={styles.stateItem}>
              <HomeAlt width={40} height={40} color={"black"} />
              <View style={getStatusStyles.home}></View>
            </View>
          </View>

          <View style={styles.containerCar}>
            <StyledText title bold>
              Productos
            </StyledText>

            <FlatList
              renderItem={renderItemC}
              data={cart}
              keyExtractor={(item) => item.idCartItem.toString()}
              columnWrapperStyle={styles.columnWrapper}
              width="100%"
              ListEmptyComponent={
                <StyledText>No hay productos en esta orden</StyledText>
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    marginTop: 20,
  },
  buttonAdd: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    marginStart: "10%",
    padding: 2,
    width: "70%",
  },
  buttonPlus: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderRadius: 5,
    marginStart: "35%",
    padding: 2,
    width: "30%",
  },
  color: {
    backgroundColor: theme.colors.green,
    borderTopColor: theme.colors.grey,
    borderTopWidth: 1,
    height: 8,
    width: "100%",
  },
  colorN: {
    backgroundColor: theme.colors.greenOpacity,
    borderTopColor: theme.colors.grey,
    borderTopWidth: 1,
    height: 8,
    width: "100%",
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  containerState: {
    flexDirection: "row",
    marginBottom: 15,
    marginStart: "15%",
    width: "70%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    width: "100%",
  },
  stateItem: {
    alignItems: "center",
    borderColor: theme.colors.grey,
    borderWidth: 1,
    height: 50,
    width: "33%",
  },
});

export default DetailOrder;
