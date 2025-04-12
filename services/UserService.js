import * as SecureStore from "expo-secure-store";
import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";

export async function getInfoUserId(idUser) {
  //const idUser = await SecureStore.getItemAsync("id_user");
  const endpoint = `${API_URL}user/${idUser}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });

    if (!response.ok) {
      throw new Error("No se encontró el user");
    }

    const rts = await response.json();

    const userInfo = {
      name: rts.name,
      department: rts.department,
      city: rts.city,
      email: rts.email,
      cell: rts.cell,
    };

    await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo));

    return "Se alamceno la informacion del usuario corectamente";
  } catch (error) {
    console.error("Error fetching get user info:", error);
    throw error;
  }
}
