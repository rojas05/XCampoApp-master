import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import theme from "../../src/theme/theme.js";
/* Componentes */
import {
  ProfileTemplate,
  BtnEdit,
  BtnCloseSeson,
} from "../../src/components/ProfileTemplate.jsx";
import StoreMapPin from "../../src/components/Map/StoreMapPin.jsx";
import ProfileCalification from "../../src/components/ProfileCalification.jsx";
/* Funtions */
import { getSellerById, getSellerID } from "../../services/SellerService.js";
import { getOtherURLsFromString } from "../../fetch/UseFetch.js";
import { getCoordinates } from "../../funcions/getCoordinates.js";
import { formatPrice } from "../../src/utils/constants.js";

const SellerProfile = ({ route }) => {
  const { idUser } = route.params || {};
  const [photos, setPhotos] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [sellerData, setSellerData] = useState({
    name_store: "Tienda Juan",
    location: "Pitalito - Calle Ficticia 123",
    profileImage:
      "https://thumbs.dreamstime.com/b/simple-tienda-online-logo-concepto-vector-210636270.jpg",
    bannerImage:
      "https://i0.wp.com/acimedellin.org/wp-content/uploads/2018/11/banner-mercados.jpg?fit=1200%2C620&ssl=1g",
    role: "Vendedor",
    description:
      "Bienvenidos a Tienda Ejemplo, donde podrás encontrar una variedad de productos de alta calidad a precios accesibles.",
    rating: 4,
    salesTotal: 2500,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const sellerID = await getSellerID(idUser);
        if (!sellerID) throw new Error("ID del vendedor no encontrado");

        const data = await getSellerById(sellerID);
        if (!data) throw new Error("No se encontró información del vendedor");

        const coordinates = await getCoordinates(data.coordinates);

        setSellerData((prevData) => ({
          ...prevData,
          name_store: data.name_store || prevData.name_store,
          location: data.location || prevData.location,
          description: data.location_description || prevData.description,
          totalEarnings: data.totalEarnings || prevData.totalEarnings,
        }));

        setPhotos(getOtherURLsFromString(data.img));
        setInitialRegion(coordinates);
      } catch (error) {
        console.error("Error al obtener datos del vendedor:", error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [idUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.blue} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ProfileTemplate
        userName={sellerData.name_store}
        profileImage={sellerData.profileImage}
        bannerImage={sellerData.bannerImage}
        role={sellerData.role}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="storefront-outline" size={24} color="black" />{" "}
          Imágenes de la Tienda
        </Text>
        <ImageSelector images={photos} />
      </View>

      <ProfileCalification />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <FontAwesome5 name="money-bill-wave-alt" size={24} color="black" />{" "}
          Ganancias del Mes:
        </Text>
        <Text style={styles.amount}>
          ${formatPrice(sellerData.totalEarnings)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <FontAwesome name="map-pin" size={20} /> Cómo Llegar
        </Text>
        <View style={styles.mapImage}>
          <StoreMapPin store={sellerData} initialRegion={initialRegion} />
        </View>
        <Text style={styles.location}>{sellerData.location}</Text>
      </View>

      <BtnEdit
        onEditProfile={() => alert("Editar perfil")}
        onChangeRole={() => alert("Cambiar rol")}
      />
      <BtnCloseSeson onLogout={() => alert("Cerrar sesión")} />
    </ScrollView>
  );
};

const ImageSelector = ({ images }) => {
  const [loadingStates, setLoadingStates] = useState(images.map(() => true));
  const [errorStates, setErrorStates] = useState(images.map(() => false));

  const handleImageLoad = (index) => {
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const handleImageError = (index) => {
    setErrorStates((prev) => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  const renderContent = () => {
    if (!images || images.length === 0) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No hay imágenes disponibles</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageRow}>
        {images.map((uri, index) => (
          <TouchableOpacity
            key={index}
            delayLongPress={10}
            onLongPress={() => console.log("Presionado")}
          >
            <View style={styles.imageWrapper}>
              {loadingStates[index] && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    style={styles.loader}
                    size="small"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.loadingText}>Cargando imagen...</Text>
                </View>
              )}
              <Image
                source={{ uri }}
                style={[styles.image, errorStates[index] && styles.imageError]}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                loading="lazy"
                resizeMode="cover"
              />
              {errorStates[index] && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Error al cargar la imagen
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return <View style={styles.imageContainer}>{renderContent()}</View>;
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
  location: {
    color: theme.colors.greyBlack,
    fontSize: 16,
    marginTop: 8,
  },
  mapImage: { height: 250, width: "100%" },
  // eslint-disable-next-line react-native/sort-styles, react-native/no-color-literals
  errorContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 10,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 12,
    padding: 5,
    textAlign: "center",
  },
  image: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 10,
    borderWidth: 2,
    height: 100,
    marginHorizontal: 10,
    width: 150,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageError: {
    opacity: 0.3,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageWrapper: {
    height: 100,
    marginHorizontal: 10,
    position: "relative",
    width: 150,
  },
  loader: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 1,
  },
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
  messageContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderRadius: 10,
    justifyContent: "center",
    marginHorizontal: 10,
    padding: 20,
  },
  messageText: {
    color: theme.colors.gray,
    fontSize: 16,
    textAlign: "center",
  },
});

export default SellerProfile;
