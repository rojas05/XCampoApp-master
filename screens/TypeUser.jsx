import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Constants from "expo-constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomeAlt, Delivery, User } from "iconoir-react-native";

import { fetchWithToken, getToken } from "../tokenStorage";
import { getData, responseHeader } from "../fetch/UseFetch";
import API_URL from "../fetch/ApiConfig";

import theme from "../src/theme/theme";
import StyledText from "../src/styles/StyledText";
import { CustomAlert } from "../src/components/Alerts/CustomAlert";
import { openCamera, openGallery } from "../src/utils/ImagePickerHandler";

import { setRolData } from "./TypeUserFuntion";
import RoleForm from "../src/components/RoleForm";
import { getSavedLocation } from "../funcions/getCoordinates";

const useRoles = (initialRoles) => {
  return {
    seller: !initialRoles.includes("SELLER"),
    deliveryMan: !initialRoles.includes("DELIVERYMAN"),
    client: !initialRoles.includes("CLIENT"),
  };
};

const TypeUser = () => {
  const route = useRoute();
  const { idUser, roles: initialRoles } = route.params;
  const roles = useRoles(initialRoles);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [formData, setFormData] = useState({
    store: "",
    indications: "",
    coordinates: null,
    location: "",
    routeDelivery: "",
    nameClient: "",
    indicationsClient: "",
  });
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState();

  const navigation = useNavigation();

  const messageError = "Este campo es requerido.";

  useEffect(() => {
    const fetchLocation = async () => {
      getCityUser();

      const savedLocation = await getSavedLocation();
      setFormData((prev) => ({ ...prev, coordinates: savedLocation }));
    };

    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCityUser() {
    try {
      const idUser = await getToken("id");
      const response = await fetchWithToken(`${API_URL}user/${idUser}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        getDateAPINoToken(
          `firebase/veredas/municipio?nombreMunicipio=${data.city}`,
          setLocations,
        );
        setCity(data.city);
      } else {
        console.log(response);
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
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleLocationPress = async () => {
    const savedLocation = await getSavedLocation();
    setFormData((prev) => ({ ...prev, coordinates: savedLocation }));
    Alert.alert("Ubicacion agregada", "Se agrego su ubicaion");
  };

  const addPhoto = () => {
    if (photos.length >= 2) {
      Alert.alert("Límite alcanzado", "El límite es dos fotos.");
      return;
    }
    setAlertVisible(true);
  };

  const removePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleChangeText = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const roleValidations = {
    SELLER: () => {
      const errors = {};
      if (!formData.store) errors.store = messageError;
      if (!formData.indications) errors.indications = messageError;
      if (!formData.coordinates) errors.coordinates = messageError;
      if (!formData.location) errors.location = messageError;
      return errors;
    },
    DELIVERYMAN: () => {
      const errors = {};
      if (!formData.routeDelivery) errors.routeDelivery = messageError;
      return errors;
    },
    CLIENT: () => {
      const errors = {};
      if (!formData.nameClient) errors.nameClient = messageError;
      if (!formData.indicationsClient) errors.indicationsClient = messageError;
      return errors;
    },
  };

  const validateForm = async (rol) => {
    const errors = roleValidations[rol]();
    console.log(errors);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      let data = {};

      switch (rol) {
        case "SELLER":
          data = {
            name_store: formData.store,
            coordinates: JSON.stringify(formData.coordinates),
            location: formData.location,
            location_description: formData.indications,
            img: null,
          };
          break;

        case "DELIVERYMAN":
          data = { rute: formData.routeDelivery };
          break;

        case "CLIENT":
          data = {
            name: formData.nameClient,
            location_destiny: JSON.stringify(formData.coordinates),
            location_description: formData.indicationsClient,
          };
          break;

        default:
          console.error("Rol no válido.");
          return;
      }

      try {
        const idRoles = await setRol(rol, idUser);

        if (idRoles) {
          await setRolData(
            rol.toLowerCase(),
            idRoles,
            data,
            photos,
            idUser,
            setLoading,
            navigation,
            setImageUploadError,
          );
        } else {
          console.error("No se pudo obtener el ID del rol.");
        }
      } catch (error) {
        console.error("Error en la validación del formulario:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  async function setRol(rol, idUser) {
    const requestBody = {
      roles_id: null,
      nameRole: rol,
    };
    const endpoint = `${API_URL}rol/${idUser}`;

    try {
      const response = await fetchWithToken(
        endpoint,
        responseHeader(requestBody, "POST"),
      );
      const dataRequest = await response.json();

      if (response.ok) {
        return dataRequest.roles_id;
      } else {
        console.error("Error en la respuesta del servidor:", dataRequest);
        return null;
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      return null;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <StyledText title bold>
          ¿Como quieres iniciar?
        </StyledText>
        <StyledText>
          recuarda que puedes cambiar tu rol en cualquier momento
        </StyledText>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.center}>
          {roles.seller && (
            <RoleForm
              role={{
                name: "Vendedor",
                icon: <HomeAlt width={25} height={25} color={"black"} />,
              }}
              fields={[
                { name: "store", placeholder: "Nombre de la finca" },
                { name: "location", placeholder: "Vereda que reside" },
                {
                  name: "indications",
                  placeholder: "Indicaciones para llegar a la finca",
                },
                { name: "coordinates", placeholder: "location" },
              ]}
              errors={errors}
              loading={loading}
              onSubmit={() => validateForm("SELLER")}
              onChangeText={handleChangeText}
              photos={photos}
              addPhoto={addPhoto}
              removePhoto={removePhoto}
              imageUploadError={imageUploadError}
              handleLocationPress={() => handleLocationPress()}
              locations={locations}
            />
          )}

          {roles.deliveryMan && (
            <RoleForm
              role={{
                name: "Repartidor",
                icon: <Delivery width={25} height={25} color={"black"} />,
              }}
              fields={[{ name: "routeDelivery", placeholder: locations }]}
              errors={errors}
              loading={loading}
              onSubmit={() => validateForm("DELIVERYMAN")}
              onChangeText={handleChangeText}
              locations={locations}
            />
          )}

          {roles.client && (
            <RoleForm
              role={{
                name: "Cliente",
                icon: <User width={25} height={25} color={"black"} />,
              }}
              fields={[
                { name: "nameClient", placeholder: "Nombre de cliente" },
                { name: "indicationsClient", placeholder: "Indicaciones" },
                { name: "coordinates", placeholder: "location" },
              ]}
              errors={errors}
              loading={loading}
              onSubmit={() => validateForm("CLIENT")}
              onChangeText={handleChangeText}
              handleLocationPress={() => handleLocationPress()}
            />
          )}
        </View>
        <CustomAlert
          visible={isAlertVisible}
          onClose={() => setAlertVisible(false)}
          onCamera={() => openCamera(setPhotos, setAlertVisible)}
          onGallery={() => openGallery(setPhotos, setAlertVisible)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    paddingBottom: 20,
  },
  container: {
    backgroundColor: theme.colors.yellow,
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scroll: {
    backgroundColor: theme.colors.opacity,
    paddingVertical: 10,
  },
  title: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
  },
});

export default TypeUser;
