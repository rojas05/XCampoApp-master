import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import string from "../string/string";

export const openCamera = async (setImagen, setAlertVisible) => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    alert(string.alertAddProduct.CAMERA_PERMISSION);
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1,
  });

  if (!result.canceled) {
    // Obtener tamaño del archivo
    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

    // 10MB en bytes
    if (fileInfo.size > 10 * 1024 * 1024) {
      alert("El archivo es demasiado grande (máx. 10MB).");
      return;
    }

    setImagen((prev) => [...prev, result.assets[0].uri]);
  }
  setAlertVisible(false);
};

export const openGallery = async (setImagen, setAlertVisible) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert(string.GALLERY_PERMISSION);
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    // Obtener tamaño del archivo
    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

    // 10MB en bytes
    if (fileInfo.size > 10 * 1024 * 1024) {
      alert("El archivo es demasiado grande (máx. 10MB).");
      return;
    }

    setImagen((prev) => [...prev, result.assets[0].uri]);
  }
  setAlertVisible(false);
};
