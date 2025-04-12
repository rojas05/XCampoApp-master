import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";

export async function getNameClient(idClient) {
  const endpoint = `${API_URL}client/name/${idClient}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });

    if (!response.ok) {
      throw new Error("No se encontró el cliente");
    }

    const rts = await response.json();
    return rts.message;
  } catch (error) {
    console.error("Error fetching get name client:", error);
    throw error;
  }
}
