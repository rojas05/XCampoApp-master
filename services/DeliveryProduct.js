import * as SecureStore from "expo-secure-store";
import { responseHeader } from "../fetch/UseFetch";
import { fetchWithToken } from "../tokenStorage";
import { getSavedLocation } from "../funcions/getCoordinates";
import API_URL from "../fetch/ApiConfig";

export async function postDeliveryProduct(orderId) {
  let state = "DISPONIBLE";

  try {
    const deliveryProducts = {
      available: true,
      state: state,
      startingPoint: await getSavedLocation(),
      destiny: "",
      orderId: orderId,
    };

    const response = await fetchWithToken(
      `${API_URL}delivery`,
      responseHeader(deliveryProducts, "POST"),
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al crear el delivery products: " + data);
    }
  } catch (error) {
    console.error("Error : " + error);
  }
}

export async function getDeliveryProductsState(state, municio) {
  const endpoint = `${API_URL}delivery/getAll/${state}/${municio}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (response.status !== 302)
      throw new Error("No se pudo obtener los envios disponbles");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching get list delivery products:", error);
    throw error;
  }
}

export async function getDeliveryProductsStateMaps(municipio) {
  const userInfo = await SecureStore.getItemAsync("userInfo");
  const { department } = JSON.parse(userInfo);

  let state = "DISPONIBLE";
  let endpoint = `${API_URL}delivery/getListGroup/${state}/${department}`;

  // Construir la cadena de parámetros para los municipios
  const municipioParams = municipio
    .map((municipio) => `municipio=${encodeURIComponent(municipio)}`)
    .join("&");

  // Agregar los parámetros a la URL si hay municipios
  if (municipioParams) {
    endpoint += `?${municipioParams}`;
  }

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    let result = await response.json();

    if (!response.ok)
      throw new Error(
        "No se pudo obtener los envios disponbles, " + JSON.stringify(result),
      );

    return result;
  } catch (error) {
    console.error("Error fetching get list delivery products map:", error);
  }
}

export async function getDeliveryById(idDelivery) {
  const endpoint = `${API_URL}delivery/found/${idDelivery}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    let result = await response.json();

    if (response.status !== 302)
      throw new Error(
        "No se encontro envios disponbles ",
        JSON.stringify(result),
      );

    return result;
  } catch (error) {
    console.error("Error fetching get delivery products:", error);
  }
}

export async function getDeliveryOrderById(idOrder) {
  const endpoint = `${API_URL}delivery/idOrder/${idOrder}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    let result = await response.json();

    if (response.status !== 200)
      throw new Error(
        "No se encontro envios disponbles, " + JSON.stringify(result),
      );

    return result;
  } catch (error) {
    console.error("Error fetching get list delivery products:", error);
    throw error;
  }
}

export async function updateStateDeliveryProducts(idDelivery, state) {
  const requestBody = {
    id: idDelivery,
    state: state,
  };

  try {
    const response = await fetchWithToken(
      `${API_URL}delivery/updateState`,
      responseHeader(requestBody, "PATCH"),
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el estado del delivery");
    }

    const result = await response.text();
    return result;
  } catch (error) {
    console.error("Error en updateStateDeliveryProducts:", error);
    // throw error; capturar el error
  }
}

export async function getCountDeliveryAvailable(municipio) {
  let state = "DISPONIBLE";
  const endpoint = `${API_URL}delivery/getTotalAvailable/${state}/${municipio}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.status === 200)
      throw new Error("No se pudo obtener el total Ordenes dispobles");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order length:", error);
    throw error;
  }
}
