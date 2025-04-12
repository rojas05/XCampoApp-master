import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Constants from "expo-constants";
import {
  CartAlt,
  BellNotification,
  Search,
  FastArrowRight,
  MapPin,
} from "iconoir-react-native";
import { useNavigation } from "@react-navigation/native";

import API_URL from "../../fetch/ApiConfig";
import { getData } from "../../fetch/UseFetch";
import { fetchWithToken, getToken } from "../../tokenStorage";

import theme from "../../src/theme/theme";
import string from "../../src/string/string";
import StyledText from "../../src/styles/StyledText";
import StyledItemProduct from "../../src/styles/StyledItemProduct";
import ItemProductSearch from "../../src/components/ItemProductSearch";

const HomeClient = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState();
  const [citys, setCitys] = useState([]);
  const [allStore, setAllstore] = useState([]);
  const [locationStore, setLocationStore] = useState([]);
  const [cart, setCart] = useState([]);
  const [idClient, setIdClient] = useState();
  const [products, setProducts] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const idUser = await getToken("id");
    console.log(idUser);
    getDateAPI(`${API_URL}client/idUser/${idUser}`, setIdClient);
    getDateAPI(`${API_URL}ShoppingCart/id/${idUser}`, setCart);
    getCityUser();
  }

  async function getCityUser() {
    try {
      const idUser = await getToken("id");
      const response = await fetchWithToken(`${API_URL}user/${idUser}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        getDateAPI(`${API_URL}seller/city/${data.city}`, setAllstore);
        getDateAPINoToken(
          `firebase/municipios/get/${data.department}`,
          setCitys,
        );
        getDateAPINoToken(
          `firebase/veredas/municipio?nombreMunicipio=${data.city}`,
          setLocations,
        );
        setCity(data.city);
      } else {
        console.warn("Get city user: " + response);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const getDateAPINoToken = useCallback(async (url, setDate) => {
    try {
      const { data, error } = await getData(url);
      if (data) {
        setDate(data);
      }

      if (error) {
        console.warn("[getDateAPINoToken] " + error);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getDateAPI = useCallback(async (url, setDate) => {
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

  async function search(letter) {
    if (letter === "") {
      setProducts();
      return;
    }
    try {
      const response = await fetchWithToken(
        `${API_URL}products/search?letter=${letter}&city=${city}`,
        {
          method: "GET",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setProducts();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function orders() {
    navigation.navigate("Orders", {
      id: idClient,
    });
  }

  async function navigateCart() {
    const idUser = await getToken("id");
    await getDateAPI(`${API_URL}ShoppingCart/id/${idUser}`, setCart);
    navigation.navigate("Cart", {
      idCart: cart,
      city: city,
      idClient: idClient,
    });
  }

  async function selectLocation(itemValue) {
    getDateAPI(`${API_URL}seller/location/${itemValue}`, setLocationStore);
    setLocation(itemValue);
  }

  const renderItem = ({ item }) => {
    return <StyledItemProduct item={item} idClient={idClient} />; // Pasa el objeto completo
  };

  const renderItemProducst = ({ item }) => {
    return <ItemProductSearch item={item} />; // Pasa el objeto completo
  };

  const renderItemLocation = ({ item }) => {
    return <StyledItemProduct item={item} store idClient={idClient} />; // Pasa el objeto completo
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MapPin width={25} height={25} color="black" style={styles.icon} />
        {/* Picker Municipio */}
        {citys.length > 0 ? (
          <Picker
            selectedValue={city}
            onValueChange={(itemValue) =>
              getDateAPI(`${API_URL}seller/city/${itemValue}`, setAllstore)
            }
            style={styles.pickerCity}
          >
            <Picker.Item
              label="Municipio"
              value={city}
              style={styles.pickerItem}
            />
            {citys.map((city) => (
              <Picker.Item
                key={city.id}
                label={city.nombre}
                value={city.nombre}
              />
            ))}
          </Picker>
        ) : (
          <ActivityIndicator></ActivityIndicator>
        )}

        {/* Picker Domicilio */}
        <View style={styles.containerPiker}>
          <Text style={styles.pickerText}>Domicilio</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            orders();
          }}
        >
          <BellNotification
            width={30}
            height={30}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
        {cart ? (
          <TouchableOpacity
            onPress={() => {
              navigateCart();
            }}
          >
            <CartAlt width={30} height={30} color="black" style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Crea tu carrito",
                "Apoya a los productores de ru region",
              );
            }}
          >
            <CartAlt width={30} height={30} color="black" style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subheader */}
      <View style={styles.subHeader}>
        <View style={styles.search}>
          <Search width={28} height={28} color="gray" style={styles.icon} />
          <TextInput
            style={{ width: 150 }}
            placeholder={string.client.search}
            onChangeText={(newText) => {
              search(newText);
            }}
          />
        </View>
      </View>

      {products ? (
        <View>
          <FlatList
            data={products}
            renderItem={renderItemProducst}
            keyExtractor={(item) => item.id_product}
            numColumns={1}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      ) : (
        <View style={{ height: "100%" }}>
          {/* Store Section */}
          <View style={styles.store}>
            <StyledText title bold>
              {string.client.near}
            </StyledText>
            <FastArrowRight
              width={28}
              height={28}
              color="black"
              style={styles.icon}
            />
          </View>

          {/* Horizontal Scroll */}
          <View style={styles.scrollHorizontal}>
            <FlatList
              data={allStore}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_seller.toString()}
              numColumns={1}
              columnWrapperStyle={styles.columnWrapper}
              horizontal
            />
          </View>

          {/* Location Section */}
          <View style={styles.titleLocation}>
            <Text style={styles.subTitle}>{string.client.select}</Text>
            <View style={styles.containerPiker}>
              <Picker
                selectedValue={location}
                onValueChange={(itemValue) => selectLocation(itemValue)}
                style={styles.pickerCity}
              >
                <Picker.Item
                  label="Vereda"
                  value={location}
                  style={styles.pickerItem}
                />
                {locations.map((location) => (
                  <Picker.Item
                    key={location.id}
                    label={location.nombre}
                    value={location.nombre}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Vertical Scroll */}
          <View style={styles.scroll}>
            <FlatList
              data={locationStore}
              renderItem={renderItemLocation}
              keyExtractor={(item) => item.id_seller.toString()}
              columnWrapperStyle={styles.columnWrapper}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  containerPiker: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    flexDirection: "row",
    marginEnd: 10,
  },
  containerPikerDomicilio: {
    backgroundColor: theme.colors.yellow,
    borderRadius: 8,
    flexDirection: "row",
    height: 30,
    width: "30%",
  },
  containerPikerLocation: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.black,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: "row",
    height: 100,
    marginEnd: 10,
    width: "45%",
  },
  containerScroll: {
    alignItems: "center",
    height: "40%",
  },
  containerScrollVertical: {
    alignItems: "center",
    height: "40%",
  },
  header: {
    alignItems: "center",
    backgroundColor: theme.colors.greenOpacity,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 5,
  },
  icon: {
    marginStart: 10,
  },
  pickerCity: {
    borderRadius: 5,
    height: 50,
    width: 120,
  },
  pickerItem: {
    color: theme.colors.grey,
    fontSize: 14,
  },
  pickerText: {
    fontSize: 16,
    margin: 2,
    marginStart: 5,
  },
  pickerTextLocation: {
    color: theme.colors.green,
    fontSize: 16,
    fontWeight: "bold",
    margin: 2,
    marginStart: 5,
  },
  scroll: {
    height: "40%",
    marginBottom: 10,
  },
  scrollHorizontal: {
    marginTop: 2,
    padding: "auto",
  },
  search: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderRadius: 15,
    flexDirection: "row",
    height: 40,
    marginBottom: 10,
    marginStart: 10,
    width: 200,
  },
  store: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingTop: 5,
  },
  subHeader: {
    backgroundColor: theme.colors.greenOpacity,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    flexDirection: "row",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
    width: "40%",
  },
  titleLocation: {
    backgroundColor: theme.colors.greenOpacity,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    paddingTop: 10,
    width: "100%",
  },
});

export default HomeClient;
