import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";

export async function getMunicipioByDepartament(department) {
  const endpoint = `${API_URL}firebase/municipios/get/${department}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    let result = await response.json();

    if (response.status !== 200)
      throw new Error(
        "No se pudo obtener los municipos del departamneto. " +
          JSON.stringify(result),
      );

    if (!Array.isArray(result)) {
      throw new Error("La respuesta de la API no es un array válido.");
    }

    return result.map((municipio) => municipio.nombre);
  } catch (error) {
    console.error("Error fetching municipio Departament:", error);
    throw error;
  }
}

export async function getVeredasByMunicipio(municipio) {
  console.log(municipio);
  const endpoint = `${API_URL}firebase/veredas/municipio?nombreMunicipio=${municipio}`;
  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    let result = await response.json();

    if (response.status !== 200)
      throw new Error(
        "No se pudo obtener los municipos del departamneto. " +
          JSON.stringify(result),
      );

    if (!Array.isArray(result)) {
      throw new Error("La respuesta de la API no es un array válido.");
    }

    return result.map((Vereda) => Vereda.nombre);
  } catch (error) {
    console.error("Error fetching municipio Departament:", error);
    throw error;
  }
}
