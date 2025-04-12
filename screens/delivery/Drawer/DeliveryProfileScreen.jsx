import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

/* Componentes */
import {
  ProfileTemplate,
  BtnEdit,
  BtnCloseSeson,
} from "../../../src/components/ProfileTemplate.jsx";
import theme from "../../../src/theme/theme.js";
import ProfileCalification from "../../../src/components/ProfileCalification.jsx";

const DeliveyProfile = ({ navigation }) => {
  const [loading, setLoading] = useState(null);
  const [userName, setUserName] = useState(null);
  // Datos específicos del vendedor

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await SecureStore.getItemAsync("userInfo");
        if (userInfo) {
          const { name } = JSON.parse(userInfo);
          setUserName(name);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sellerData = {
    userName: `Repartidor ${userName}`,
    profileImage: require("../../../assets/profile/icon_perfil_delivery.jpg"),
    bannerImage:
      "https://i0.wp.com/acimedellin.org/wp-content/uploads/2018/11/banner-mercados.jpg?fit=1200%2C620&ssl=1g",
    role: "Repartidor",
    rating: 4,
    salesTotal: 2500,
    onLogout: () => alert("Cerrar sesión"),
    onEditProfile: () => alert("Editar perfil"),
    onChangeRole: () => alert("Cambiar rol"),
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.blue} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <FontAwesome5 name="bars" size={20} color={theme.colors.black} />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <ProfileTemplate
          userName={sellerData.userName}
          profileImage={sellerData.profileImage}
          bannerImage={sellerData.bannerImage}
          role={sellerData.role}
        />

        <ProfileCalification />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <FontAwesome5 name="money-bill-wave-alt" size={24} color="black" />{" "}
            Ganancias del Mes:
          </Text>
          <Text style={styles.amount}>$5,230.50</Text>
        </View>

        <BtnEdit
          onEditProfile={() => alert("Editar perfil")}
          onChangeRole={() => navigation.navigate("Splash")}
        />
        <BtnCloseSeson onLogout={() => alert("Cerrar sesión")} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  amount: { fontSize: 24, fontWeight: "bold" },
  card: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 13,
    marginHorizontal: 16,
    padding: 16,
  },
  cardTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  container: { backgroundColor: theme.colors.white, flex: 1 },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    zIndex: 10,
  },
  loadingText: {
    color: theme.colors.black,
    fontSize: 16,
    marginTop: 10,
  },
  mainContainer: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  menuButton: {
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    elevation: 5,
    left: 15,
    padding: 11,
    position: "absolute",
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: 15,
    zIndex: 100,
  },
});

export default DeliveyProfile;
