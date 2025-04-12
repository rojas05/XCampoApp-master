import * as SecureStore from "expo-secure-store";

/**
 * Obtiene el token almacenado en SecureStore
 * @returns {Promise<string | null>}
 */
export async function getToken() {
  try {
    const tokenData = await SecureStore.getItemAsync("accessToken");

    if (!tokenData) {
      console.error("❌ No se encontró el token JWT en SecureStore");
      return null;
    }

    let token;
    try {
      // Intentar parsear el JSON si el token está envuelto en un objeto
      const parsed = JSON.parse(tokenData);
      token = parsed._j || parsed.token || tokenData;
    } catch {
      token = tokenData;
    }

    return token.replace(/"/g, ""); // Limpiar posibles comillas
  } catch (error) {
    console.error("❌ Error al obtener el token:", error);
    return null;
  }
}
