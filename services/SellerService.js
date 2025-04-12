import { Alert } from "react-native";
import { fetchWithToken } from "../tokenStorage";
import { UpLoadFilesPost } from "../fetch/UpLoadFiles";
import API_URL from "../fetch/ApiConfig";

export async function getSellerID(id_user) {
  const endpoint = `${API_URL}seller/idUser/${id_user}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.ok) throw new Error("No se pudo obtener el vendedor.");

    return await response.json();
  } catch (error) {
    console.error("Error fetching seller ID:", error);
    Alert.alert(
      "Error",
      "Ocurrió un error al obtener el ID del vendedor" + error,
    );
  }
}

export async function getSellerById(id_seller) {
  const endpoint = `${API_URL}seller/${id_seller}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.ok) throw new Error("No se pudo obtener el vendedor.");

    return await response.json();
  } catch (error) {
    console.error("Error fetching seller ID:", error);
    Alert.alert(
      "Error",
      "Ocurrió un error al obtener el ID del vendedor" + error,
    );
  }
}

export async function postImageFirebaseSeller(
  imagenes,
  id_seller,
  constext = "seller/location",
) {
  if (imagenes.every((file) => file.startsWith("http"))) {
    return imagenes.join(" ");
  }

  const URL = `storage/${id_seller}`;
  const remoteImages = imagenes.filter((file) => file.startsWith("http"));
  let remoteCount = remoteImages.length;

  const localImages = imagenes
    .filter((file) => file.startsWith("file://"))
    .map((file) => file);

  const result = await UpLoadFilesPost(localImages, constext, URL, remoteCount);

  const allImages =
    remoteCount === 1 || remoteCount === 2
      ? `${remoteImages} ${result}`
      : `${result}`;

  return allImages;
}

export async function updateSellerImage(Urlimage, idSeller) {
  const endpoint = `${API_URL}seller/imgUpdate/${idSeller}`;
  const formData = new FormData();

  try {
    formData.append("images", Urlimage);

    const response = await fetchWithToken(endpoint, {
      method: "PATCH",
      body: formData,
    });

    const result = await response.text();

    if (response.ok) return result;
    else throw new Error("Error al subir imagen." + result);
    //
  } catch (error) {
    console.error("Error al subir imagen", error.message);
    return error;
  }
}

export async function updateAddEarnings(idSeller, earnings) {
  const endpoint = `${API_URL}seller/addEarnings/${idSeller}?addTotal=${earnings}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "PATCH" });
    let result = await response.json();

    if (!response.ok)
      throw new Error(
        "No se puedo actualizar las ganacias: " + JSON.stringify(result),
      );
  } catch (error) {
    console.error("Error fetching update earnings:", error);
    // throw error;
  }
}

export async function getNameSeller(id_seller) {
  const endpoint = `${API_URL}seller/sellerName/${id_seller}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });

    if (!response.ok) {
      throw new Error("No se encontró el vendedor");
    }

    const rts = await response.text();
    console.log(rts);
    return rts;
  } catch (error) {
    console.error("Error fetching get name client:", error);
    throw error;
  }
}
