import React, { useCallback, useEffect, useState } from "react";
import { Xmark } from "iconoir-react-native";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import StyledText from "../../src/styles/StyledText";
import StyledItemOrder from "../../src/styles/StyledItemOrder";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchWithToken } from "../../tokenStorage";
import API_URL from "../../fetch/ApiConfig";
import theme from "../../src/theme/theme";

const Orders = () => {
  const route = useRoute();
  const { id } = route.params;

  const navigation = useNavigation();
  const [ordersPending, setOrdersPending] = useState({});
  const [ordersFinished, setOrdersFinished] = useState({});

  useEffect(() => {
    getDataAPI(`${API_URL}order/get/${id}/EN_ESPERA`, setOrdersPending);
    getDataAPI(`${API_URL}order/get/${id}/FINALIZADA`, setOrdersFinished);
  }, []);

  const getDataAPI = useCallback(async (url, setDate) => {
    try {
      const response = await fetchWithToken(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setDate(data);
      } else {
        setDate(null);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderItemP = ({ item }) => (
    <StyledItemOrder item={item}></StyledItemOrder>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Xmark width={40} height={40} color={"black"} />
        </TouchableOpacity>
        <StyledText title bold>
          Ordenes
        </StyledText>
      </View>

      <View style={styles.containerOrdenes}>
        <StyledText bold red marginBottom={"15"}>
          {" "}
          Ordenes Pendientes
        </StyledText>

        <FlatList
          data={ordersPending}
          renderItem={renderItemP}
          keyExtractor={(item) => item.idOrder}
          numColumns={1} // Especifica el número de columnas
          width="94%"
          marginStart="3%"
          horizontal
        />
      </View>

      <View style={styles.containerOrdenesReady}>
        <StyledText bold green marginBottom={"20"}>
          {" "}
          Ordenes Terminadas
        </StyledText>

        <FlatList
          data={ordersFinished}
          renderItem={renderItemP}
          keyExtractor={(item) => item.idOrder}
          numColumns={2} // Especifica el número de columnas
          width="94%"
          marginStart="3%"
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-around",
    marginBottom: 10,
  },
  container: {
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
  },
  containerOrdenes: {
    borderBottomWidth: 1,
    borderColor: theme.colors.grey,
    height: "30%",
    marginEnd: 10,
    width: "95%",
  },
  containerOrdenesReady: {
    borderBottomWidth: 1,
    borderColor: theme.colors.grey,
    height: "70%",
    marginEnd: 10,
    width: "95%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
});

export default Orders;
