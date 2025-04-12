import API_URL from "../fetch/ApiConfig";
import { fetchWithToken } from "../tokenStorage";
import { responseHeader } from "../fetch/UseFetch";
import {
  getSellerID,
  postImageFirebaseSeller,
  updateSellerImage,
} from "../services/SellerService";

export const setRolData = async (
  rol,
  idRoles,
  data,
  photos,
  idUser,
  setLoading,
  navigation,
  setImageUploadError,
) => {
  try {
    setLoading(true);

    const response = await fetchWithToken(
      `${API_URL}${rol}/${idRoles}`,
      responseHeader(data, "POST"),
    );

    if (!response.status === 201) {
      throw new Error("Error al guardar los datos del usuario.");
    }

    if (rol === "seller") {
      const idSeller = await getSellerID(parseInt(idUser));
      const imageUrl = await postImageFirebaseSeller(photos, Number(idSeller));

      if (!imageUrl) {
        throw new Error("No se pudo subir la imagen.");
      }

      await updateSellerImage(imageUrl, idSeller);
      data = { ...data, img: imageUrl };
    }

    navigation.navigate("Splash");
  } catch (error) {
    console.error("Error en setRolData:", error);
    setImageUploadError(error.message);
  } finally {
    setLoading(false);
  }
};
