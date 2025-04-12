import { fetchWithToken } from "../tokenStorage";
import API_URL from "./ApiConfig";

export const postData = async (url, requestBody) => {
  try {
    const endpoint = `${API_URL}${url}`;
    const response = await fetch(endpoint, responseHeader(requestBody, "POST"));

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const putData = async (url, requestBody) => {
  try {
    const consultaUrl = `${API_URL}${url}`;
    const response = await fetchWithToken(
      consultaUrl,
      responseHeader(requestBody, "PUT"),
    );

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(
        `Error del servidor (${response.status}): ${errorResponse}`,
      );
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error en putData:", error.message || error);
    return {
      data: null,
      error: { message: error.message || "Error desconocido en putData" },
    };
  }
};

export const getData = async (url) => {
  try {
    const endpoint = `${API_URL}${url}`;
    const response = await fetch(endpoint, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error del servidor: ${JSON.stringify(data)}`);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export function responseHeader(requestBody, method) {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };
}

// Función para obtener la primera URL de un string
export function getFirstURLFromString(urlString) {
  if (typeof urlString !== "string" || urlString.trim() === "") {
    throw new Error("El argumento debe ser un string no vacío.");
  }
  const urls = urlString.split(" "); // Divide el string en un arreglo usando el espacio como separador
  return urls[0]; // Devuelve la primera URL
}

// Función para obtener todas las URLs excepto la primera de un string
export function getOtherURLsFromString(urlString) {
  if (typeof urlString !== "string" || urlString.trim() === "") {
    throw new Error("El argumento debe ser un string no vacío.");
  }
  const urls = urlString
    .trim()
    .split(" ")
    .filter((url) => url !== ""); // Divide el string en un arreglo usando el espacio como separador
  return urls; // Devuelve las URLs desde la segunda en adelante
}
