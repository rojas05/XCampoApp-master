// Función para obtener la primera URL de un string
export function getFirstURLFromString(urlString) {
  if (typeof urlString !== "string" || urlString.trim() === "") {
    console.log("El argumento debe ser un string no vacío.");
    return "";
  }
  const urls = urlString.split(" "); // Divide el string en un arreglo usando el espacio como separador
  return urls[0]; // Devuelve la primera URL
}

// Función para obtener todas las URLs excepto la primera de un string
export function getOtherURLsFromString(urlString) {
  if (typeof urlString !== "string" || urlString.trim() === "") {
    throw new Error("El argumento debe ser un string no vacío.");
  }
  const urls = urlString.split(" "); // Divide el string en un arreglo usando el espacio como separador
  return urls; // Devuelve las URLs desde la segunda en adelante
}
