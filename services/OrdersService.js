import { Alert } from "react-native";
import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";

export async function getOrderID(id_seller, state) {
  const endpoint = `${API_URL}order/getSeller/${id_seller}/state/${state}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.status === 302)
      throw new Error("No se pudo obtener las ordenes.");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order ID:", error);
    Alert.alert("Error", "Ocurrió un error al obtener las Ordenes");
    throw error;
  }
}

export async function getOrderIdDelivery(id) {
  const endpoint = `${API_URL}order/getId/${id}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.status === 302)
      throw new Error("No se pudo obtener las ordenes.");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order ID:", error);
    Alert.alert("Error", "Ocurrió un error al obtener las Ordenes");
    throw error;
  }
}

export async function getOrderCount(id_seller, state) {
  const endpoint = `${API_URL}order/count/getSeller/${id_seller}/state/${state}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.status === 200)
      throw new Error("No se pudo obtener el total Ordenes");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order length:", error);
    Alert.alert("Error", "Ocurrió un error al obtener el total Ordenes");
    throw error;
  }
}

export async function updateStateOrderID(id_order, state) {
  const endpoint = `${API_URL}order/${id_order}/${state}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "PATCH" });
    if (!response.status === 201)
      throw new Error("No se pudo obtener las ordenes.");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching update Order state:", error);
    Alert.alert("Error", "Ocurrió un error actulizar el estado las Ordenes");
    throw error;
  }
}

export async function getIdClientByOrderID(idOrder) {
  const endpoint = `${API_URL}order/getClient/${idOrder}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.status === 302)
      throw new Error("No se entcotro el id del cliente");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order length:", error);
    Alert.alert("Error", "Ocurrió un error al obtener los datos del cliente");
    throw error;
  }
}

export async function getIdSellerByOrderID(idOrder) {
  const endpoint = `${API_URL}order/getSeller/${idOrder}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.status === 302)
      throw new Error("No se entcotro el id del vendedor");

    let result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching Order length:", error);
    Alert.alert("Error", "Ocurrió un error al obtener los datos del vendedor");
    throw error;
  }
}
