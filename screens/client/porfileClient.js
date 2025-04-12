import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import API_URL from "../../fetch/ApiConfig";
import { fetchWithToken, getToken } from "../../tokenStorage.js";
import { getSavedLocation } from "../../funcions/getCoordinates.js";

import {
  ProfileTemplate,
  BtnEdit,
} from "../../src/components/ProfileTemplate.jsx";
import { HOME_STYLES } from "../../src/utils/constants.js";
import EditClientModal from "../../src/components/EditClientModal.jsx";

const ProfileClient = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [client, setClient] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    init();
  }, []);

  const handleLocationPress = async () => {
    const savedLocation = await getSavedLocation();
    Alert.alert("Ubicacion agregada", "Se agrego su ubicaion" + savedLocation);
  };

  const handleSave = async (updatedClient) => {
    console.log("Datos enviados:", JSON.stringify(updatedClient));
    setClient(updatedClient);
    try {
      const response = await fetchWithToken(`${API_URL}client`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
      });

      if (!response.ok) {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
    console.log("Datos actualizados:", updatedClient);
  };

  async function init() {
    const idUser = await getToken("id");
    getDataAPI(`${API_URL}client/${idUser}`, setClient);
    console.log(idUser);
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
      } else {
        setDate(null);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const sellerData = {
    profileImage: "https://cdn-icons-png.freepik.com/512/5466/5466062.png",
    bannerImage:
      "https://imagenes.noticiasrcn.com/ImgNoticias/Mercados%20campesinos%20se%20toman%20nuevamente%20Bogot%C3%A1.jpg?w=480",
    onLogout: () => alert("Cerrar sesión"),
    onEditProfile: () => setIsModalVisible(true),
    onChangeRole: () => navigation.navigate("Splash"),
  };

  return (
    <View style={HOME_STYLES.container}>
      {client ? (
        <>
          <ProfileTemplate
            userName={client.name}
            description={`Las inidicaciones de mi casa son: ${client.location_description}`}
            profileImage={sellerData.profileImage}
            bannerImage={sellerData.bannerImage}
            role={"Cliente"}
          />

          <EditClientModal
            visible={isModalVisible}
            client={client}
            onClose={() => setIsModalVisible(false)}
            onSave={handleSave}
            handleLocationPress={() => handleLocationPress()}
          />

          <View style={styles.sellerInfo}>
            <Text style={styles.salesTotal}>
              con XCampo Apoyas los productores de tu region
            </Text>

            <BtnEdit
              onEditProfile={sellerData.onEditProfile}
              onChangeRole={sellerData.onChangeRole}
            />
          </View>
        </>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paymentMethod: {
    fontSize: 16,
  },
  ratingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 10,
  },
  salesTotal: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    paddingStart: 30,
  },
  sellerInfo: {
    height: "40%",
    justifyContent: "space-around",
    padding: 10,
    width: "100%",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },
  storeName: {
    fontSize: 15,
    marginBottom: 5,
    paddingEnd: 30,
    paddingStart: 30,
    textAlign: "justify",
  },
});

export default ProfileClient;
