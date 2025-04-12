import * as Location from "expo-location";
import { Linking } from "react-native";

const getLocationPermission = async (setOrigin, setIsLoading) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Permiso de ubicación denegado. Por favor, actívalo desde la configuración de tu dispositivo.",
      );
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setOrigin(`${location.coords.latitude},${location.coords.longitude}`);
  } catch (error) {
    alert("Hubo un problema al obtener tu ubicación.");
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

const openGoogleMaps = async (origin, destination) => {
  if (!origin) {
    alert("La ubicación no está lista todavía.");
    return;
  }

  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
  Linking.openURL(url).catch(() => alert("No se pudo abrir Google Maps."));
};

export { getLocationPermission, openGoogleMaps };
