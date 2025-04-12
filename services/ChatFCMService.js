import { responseHeader } from "../fetch/UseFetch";
import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";
import { Alert } from "react-native";

export async function sendMessageDB(requestBody) {
  const endpoint = `${API_URL}chat/send`;

  try {
    const response = await fetchWithToken(
      endpoint,
      responseHeader(requestBody, "POST"),
    );

    if (!response.ok) {
      throw new Error(
        "Ocurrio un error inesperado: " + JSON.stringify(response),
      );
    }

    return true;
  } catch (error) {
    console.error("Error fetching send message:", error);
    Alert.alert(
      "Ha ocurrio un error",
      "Ocurrió un error al enviar el mensage, comprueba tu conexion a internet",
    );
    throw error;
  }
}
