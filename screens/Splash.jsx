import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Alert,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";

import API_URL from "../fetch/ApiConfig.js";
import { getInfoUserId } from "../services/UserService";
import { getToken, fetchWithToken } from "../tokenStorage.js";
import {
  getLocationPermission,
  getSavedLocation,
} from "../funcions/getCoordinates.js";
import { registerForPushNotificationsAsync } from "../funcions/registerForPushNotificationsAsync.js";

import theme from "../src/theme/theme.js";
import StyledText from "../src/styles/StyledText.jsx";
import StyledButton from "../src/styles/StyledButton.jsx";

const Splash = () => {
  const navigation = useNavigation();
  const responseListener = useRef();
  const [roles, setRoles] = useState([]);
  const [idUser, setIdUser] = useState("");
  const [setOrigin] = useState(null);
  const [setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndFetchUserInfo = async () => {
      try {
        const idStorage = await getToken("id"); // Espera a que se resuelva el token
        const userInfo = await getToken("userInfo");
        if (!userInfo) {
          await getInfoUserId(idStorage);
        }
      } catch (error) {
        console.error("Error al verificar/obtener userInfo:", error);
      }
    };

    const fetchLocation = async () => {
      const savedLocation = await getSavedLocation();

      if (savedLocation) {
        console.log("Usando ubicación guardada:", savedLocation);
        setOrigin(savedLocation);
        setIsLoading(false);
      } else {
        console.log("No hay ubicación guardada, obteniendo nueva...");
        await getLocationPermission(setOrigin, setIsLoading);
      }

      setIsLoading(false);
    };

    getTokenMain();
    checkAndFetchUserInfo();
    registerNotificationApp();
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTokenMain, setIsLoading, setOrigin]);

  const registerNotificationApp = async () => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("🔔 Notificación presionada:", data);
        if (data.screen) {
          navigation.navigate(data.screen, {
            idProduct: data.Id,
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  };

  const getTokenMain = useCallback(async () => {
    try {
      const idStorage = await getToken("id"); // Espera a que se resuelva el token

      if (idStorage !== true) {
        getUserData(idStorage);
        registerForPushNotificationsAsync(idStorage);
      } else {
        navigation.navigate("WelcomePage");
      }
    } catch (error) {
      navigation.navigate("WelcomePage");
      console.error("Error al obtener el token:", error);
      Alert.alert("Error", "Hubo un problema al obtener el token");
    }
  }, [getUserData, navigation]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getUserData(id_user) {
    setIdUser(id_user);
    try {
      const response = await fetchWithToken(`${API_URL}rol/${id_user}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        if (JSON.stringify(data) === "[]") {
          navigation.navigate("TypeUser", {
            idUser: id_user,
            roles: roles,
          });
        } else if (response === null) {
          navigation.navigate("WelcomePage");
        } else {
          const jsonObject = JSON.parse(JSON.stringify(data));
          const valuesList = Object.values(jsonObject);
          setRoles(valuesList);
        }
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
      navigation.navigate("Hello");
    }
  }

  function rolView(rol) {
    if (rol === "DELIVERYMAN") {
      return "Repartidor";
    }
    if (rol === "SELLER") {
      return "Vendedor";
    }
    if (rol === "CLIENT") {
      return "Cliente";
    }
  }

  function rolNavigate(rol) {
    if (!idUser) {
      console.warn("idUser no está definido");
      return;
    }

    if (rol === "DELIVERYMAN") {
      navigation.navigate("HomeDelivery", { idUser });
    }
    if (rol === "SELLER") {
      navigation.navigate("HomeSeller", { idUser });
    }
    if (rol === "CLIENT") {
      navigation.navigate("IndexClient");
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.image}
      >
        <View style={styles.containerComponent}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("UserProfile", { idUser })}
          >
            <Text style={styles.profileButtonText}>👤 Ver Perfil</Text>
          </TouchableOpacity>

          <StyledText title bold>
            Bienvenido. Como vas a iniciar?
          </StyledText>
          <Image
            source={require("../assets/XCampo.png")}
            style={styles.imageIc}
          />
          <View style={styles.List}>
            <FlatList
              data={roles}
              keyExtractor={(item, index) => index.toString()} // Usamos el índice como clave única
              renderItem={({ item }) => (
                <StyledButton
                  title={rolView(item)}
                  onPress={() => {
                    rolNavigate(item);
                  }}
                ></StyledButton> // Mostramos cada valor de la lista
              )}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TypeUser", { idUser: idUser, roles: roles });
            }}
          >
            <StyledText bold blue>
              Registrar otro rol
            </StyledText>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  List: {
    backgroundColor: theme.colors.opacity,
    borderRadius: 20,
    marginBottom: 20,
    width: 250,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  containerComponent: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
  },
  imageIc: {
    borderRadius: 20,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
    width: 250,
  },
  profileButton: {
    backgroundColor: theme.colors.white,
    borderBottomStartRadius: 30,
    borderTopStartRadius: 30,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: "absolute",
    right: 0,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    top: 20,
  },
  profileButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Splash;
