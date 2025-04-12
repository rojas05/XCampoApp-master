import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { Linking } from "react-native";

let locationSubscription = null;

export const getLocationPermission = async (setOrigin, setIsLoading) => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Permiso de ubicación denegado. Por favor, actívalo desde la configuración de tu dispositivo.",
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const locationString = `${location.coords.latitude},${location.coords.longitude}`;

    // Guardar en SecureStore
    await SecureStore.setItemAsync("userLocation", locationString);
    console.log("Ubicación guardada:", locationString);

    setOrigin(locationString);
  } catch (error) {
    alert("Hubo un problema al obtener tu ubicación.");
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

export const getSavedLocation = async () => {
  try {
    const savedLocation = await SecureStore.getItemAsync("userLocation");
    return savedLocation || null;
  } catch (error) {
    console.error("Error al obtener la ubicación guardada:", error);
    return null;
  }
};

export const getCoordinates = async (coordinates) => {
  let cadena = JSON.stringify(coordinates);

  cadena = cadena.replace(/\\/g, "").replace(/"/g, "");

  const partes = cadena.split(",");

  const latitude = parseFloat(partes[0].trim());
  const longitude = parseFloat(partes[1]?.trim());

  return {
    latitude: latitude,
    longitude: longitude,
    longitudeDelta: 0.01,
    latitudeDelta: 0.03,
  };
};

export const openGoogleMaps = async (origin, destination) => {
  if (!origin) {
    alert("La ubicación no está lista todavía.");
    return;
  }

  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
  Linking.openURL(url).catch(() => alert("No se pudo abrir Google Maps."));
};

export const startTrackingLocation = async (setOrigin) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert(
      "Permiso de ubicación denegado. Por favor, actívalo desde la configuración de tu dispositivo.",
    );
    return;
  }

  try {
    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Cada 5 segundos
        distanceInterval: 10, // O cada 10 metros recorridos
      },
      async (location) => {
        const locationString = `${location.coords.latitude},${location.coords.longitude}`;

        await SecureStore.setItemAsync("userLocation", locationString);

        setOrigin((prev) => ({
          ...prev,
          origin: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
        }));
      },
    );
  } catch (error) {
    console.error("Error al rastrear la ubicación:", error);
  }
};

export const stopTrackingLocation = () => {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
    console.log("Rastreo de ubicación detenido.");
  }
};
