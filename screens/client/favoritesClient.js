import React, { useCallback, useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Constants from "expo-constants";

import API_URL from "../../fetch/ApiConfig";
import { fetchWithToken, getToken } from "../../tokenStorage";

import string from "../../src/string/string";
import StyledText from "../../src/styles/StyledText";
import StyledItemProduct from "../../src/styles/StyledItemProduct";

const FavoriteClient = () => {
  const [seller, setSeller] = useState();
  const [idClient, setIdClient] = useState();

  useEffect(() => {
    async function init() {
      const idUser = await getToken("id");
      getDataAPI(`${API_URL}client/idUser/${idUser}`, setIdClient);
    }

    init();
  }, [getFavorites(), getDataAPI]);

  async function getFavorites() {
    getDataAPI(`${API_URL}order/favorite/${idClient}`, setSeller);
  }

  const getDataAPI = useCallback(async (url, setDate) => {
    try {
      const response = await fetchWithToken(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setDate(data);
        console.log(data);
      } else {
        setDate(null);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderItem = ({ item }) => {
    return <StyledItemProduct item={item} store idClient={idClient} />; // Pasa el objeto completo
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText bold title>
          {string.client.favoriteStore}
        </StyledText>
      </View>
      <View style={styles.containerScroll}>
        <FlatList
          data={seller}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_seller.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.STATUSBAR_HEIGHTHeight,
  },
  containerScroll: {
    alignItems: "center",
    with: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scroll: {
    marginTop: 20,
    padding: "auto",
    with: 300,
  },
});

export default FavoriteClient;
