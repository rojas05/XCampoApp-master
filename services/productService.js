import { Alert } from "react-native";
import { putData, responseHeader } from "../fetch/UseFetch";
import { UpLoadFilesPost } from "../fetch/UpLoadFiles";
import { fetchWithToken } from "../tokenStorage";
import API_URL from "../fetch/ApiConfig";
import { postCategory } from "./CategoryService";

export async function createProduct(form, sellerId) {
  try {
    let categoryId = form.categoria;

    // Si la categoría es un string, la creamos
    if (isNaN(categoryId)) {
      categoryId = await postCategory(form.categoria);
      if (!categoryId) return { show: false };
    }

    const productData = {
      name: form.productName,
      description: form.productDescription,
      state: true,
      stock: parseInt(form.stock),
      price: parseInt(form.productPrice * 1000),
      measurementUnit: form.unidad,
      seller: { id_seller: sellerId },
      category: { id_category: categoryId },
      urlImage: "",
    };

    const response = await fetchWithToken(
      `${API_URL}products`,
      responseHeader(productData, "POST"),
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al crear producto: " + JSON.stringify(data));
    }

    const idProduct = data.id_product;

    return { show: true, idProduct };
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "Hubo un problema con la solicitud.");
    return false;
  }
}

export async function postImageFirebase(imagenes, id_product) {
  if (imagenes.every((file) => file.startsWith("http"))) {
    return imagenes.join(" ");
  }

  if (!id_product || isNaN(id_product)) {
    console.error("Error: id_product no es válido:", id_product);
    return;
  }

  const URL = `storage/${id_product}`;
  const remoteImages = imagenes.filter((file) => file.startsWith("http"));
  let remoteCount = remoteImages.length;
  // Filtrar imágenes locales y diferenciar las URLs
  const localImages = imagenes
    .filter((file) => file.startsWith("file://"))
    .map((file) => file);

  const uploadedImages = await UpLoadFilesPost(
    localImages,
    "products",
    URL,
    remoteCount,
  );

  const allImages =
    remoteCount === 1 || remoteCount === 2
      ? `${remoteImages} ${uploadedImages}`
      : `${uploadedImages}`;

  return allImages;
}

export async function updateProductImage(image, id_product, idSeller) {
  const endpoint = `${API_URL}products/${id_product}/imgUpdate/${idSeller}`;
  const formData = new FormData();

  try {
    formData.append("images", image);

    const response = await fetchWithToken(endpoint, {
      method: "PATCH",
      body: formData,
    });

    const result = await response.text();

    if (response.ok) return result;
    else throw new Error("Error al subir imagen." + result);
  } catch (error) {
    console.error("Error al subir imagen", error.message);
    return error;
  }
}

export async function updateProductStock(stock, id_product, idSeller) {
  const endpoint = `${API_URL}products/${id_product}/stock/${idSeller}`;
  const formData = new FormData();
  formData.append("stock", stock);

  try {
    const response = await fetchWithToken(endpoint, {
      method: "PATCH",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    const result =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar el stock");
    }

    return true;
  } catch (error) {
    console.error("Error al actualizar el stock del producto:", error.message);
    throw error;
  }
}

export async function updateProductId(
  form,
  id_product,
  idSeller,
  idCategoria,
  imageUrl,
) {
  try {
    const endpoint = `products/${id_product}`;
    const requestBody = {
      name: form.productName,
      description: form.productDescription,
      measurementUnit: form.unidad,
      price: parseInt(form.productPrice),
      stock: parseInt(form.stock),
      seller: {
        id_seller: idSeller,
      },
      category: {
        id_category: idCategoria,
        name: form.categoria,
      },
    };

    await updateProductImage(imageUrl, id_product, idSeller);
    const { data, error } = await putData(endpoint, requestBody);

    if (error) {
      Alert.alert("Error", error.message);
      return false;
    }

    if (data.statusCode === "OK")
      Alert.alert(
        "Éxito",
        `Se actualizo el producto correctamente:\n${data.join("\n")}`,
      );

    return true;
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "Hubo un problema con la solicitud.");
    return false;
  }
}

export async function listAllProductBySeller(id_seller) {
  const endpoint = `${API_URL}products/listAll/${id_seller}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.ok)
      throw new Error("No se pudo obtener los productos del vendedor");

    return await response.json();
  } catch (error) {
    console.error("Error fetching seller product list: ", error);
    Alert.alert(
      "Error",
      "Ocurrió un error al obtener los productos del vendedor" + error,
    );
  }
}

export async function deleteProductId(id_product, idSeller) {
  try {
    const endpoint = `${API_URL}products/${id_product}/${idSeller}`;
    const response = await fetchWithToken(endpoint, {
      method: "DELETE",
    });

    if (response.status === 204) {
      // No hay contenido, pero la eliminación fue exitosa
      console.log("Éxito", "Producto eliminado correctamente.");
      return;
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      Alert.alert("Error", `No se pudo eliminar el producto: ${errorMessage}`);
      throw new Error("Error al eliminar producto: " + errorMessage);
    }

    // Si hay contenido en la respuesta, intenta procesarlo
    const data = await response.json();
    if (data.statusCode === "OK") {
      console.log("Éxito", "Producto eliminado correctamente.");
    }
  } catch (error) {
    console.error("Error al eliminar:", error.message);
    Alert.alert("Error", "Hubo un problema con la solicitud.");
  }
}

export async function findProductByID(id_product) {
  const endpoint = `${API_URL}products/${id_product}`;

  try {
    const response = await fetchWithToken(endpoint, { method: "GET" });
    if (!response.ok)
      throw new Error("No se pudo obtener el producto con el ID " + id_product);

    return await response.json();
  } catch (error) {
    console.error("Error fetching product list ID: ", error);
    Alert.alert(
      "Error",
      "Ocurrió un error al obtener el productos con el ID" + error,
    );
  }
}
