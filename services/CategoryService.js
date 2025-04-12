import { Alert } from "react-native";
import { responseHeader } from "../fetch/UseFetch";
import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";

export async function postCategory(categoria) {
  const endpoint = `${API_URL}category`;
  const requestBody = {
    name: categoria,
    productList: [],
  };

  try {
    const response = await fetchWithToken(
      endpoint,
      responseHeader(requestBody, "POST"),
    );

    if (response.ok) {
      const data = await response.json();
      const id_product = data.id_category;
      return id_product;
    } else {
      Alert.alert("Error", "No se pudo obtener el ID de la categoría.");
      return;
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }
}

export async function searchCategories(query) {
  const endpoint = `${API_URL}category/search/${query}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (response.status === 302) {
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    }

    return [];
  } catch (error) {
    console.error("Error searching categories:", error);
    return [];
  }
}
