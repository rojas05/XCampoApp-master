import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";

import API_URL from "../fetch/ApiConfig";
import { fetchWithToken } from "../tokenStorage";
import { responseHeader } from "../fetch/UseFetch";

export async function registerForPushNotificationsAsync(id) {
  let token;

  if (!Device.isDevice) {
    console.warn("Las notificaciones solo funcionan en dispositivos físicos.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permisos de notificación no concedidos.");
    return null;
  }

  token = (await Notifications.getDevicePushTokenAsync()).data;
  //console.log("Token de notificación:", token);

  const storedToken = await SecureStore.getItemAsync("pushToken");

  if (!storedToken || storedToken !== token) {
    console.log("Guardando nuevo token...");
    await SecureStore.setItemAsync("pushToken", token);
    await enviarTokenAServidor(token, id);
  }

  return token;
}

async function enviarTokenAServidor(token, id) {
  const endpoint = `${API_URL}user/nfs`;
  const requestBody = {
    user_id: id,
    nfs: token,
  };

  try {
    const response = await fetchWithToken(
      endpoint,
      responseHeader(requestBody, "PATCH"),
    );

    if (response.ok) {
      console.log("Token enviado correctamente al servidor.");
    } else {
      console.error(
        "Error al enviar el token al servidor:",
        JSON.stringify(response),
      );
    }
  } catch (error) {
    console.error("Error enviando el token:", JSON.stringify(error));
  }
}
