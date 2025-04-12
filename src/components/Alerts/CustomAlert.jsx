import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CustomAlert = ({ visible, onClose, onCamera, onGallery }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>Seleccionar Imagen</Text>
          <TouchableOpacity style={styles.optionButton} onPress={onCamera}>
            <FontAwesome name="camera" size={24} color="black" />
            <Text style={styles.optionText}>Tomar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={onGallery}>
            <FontAwesome name="photo" size={24} color="black" />
            <Text style={styles.optionText}>Elegir de Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.optionText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AlertOk = ({ visible, messege, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{messege}</Text>
          <Image
            source={require("../../../assets/checkList.png")}
            style={styles.image}
          />
          <TouchableOpacity style={styles.optionButton} onPress={onClose}>
            <Text style={styles.optionText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const handleLongPress = (index, imagen, setImagen) => {
  Alert.alert(
    "¿Deseas eliminar la imagen?",
    "Selecciona una opción",
    [
      {
        text: "Eliminar",
        onPress: () => {
          const newImagen = imagen.filter((_, i) => i !== index);
          setImagen(newImagen);
        },
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ],
    { cancelable: true },
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "80%",
  },
  cancelButton: {
    backgroundColor: "#f1948a",
  },
  image: {
    borderRadius: 10,
    height: 120,
    marginBottom: 10,
    resizeMode: "cover",
    width: 120,
  },
  optionButton: {
    alignItems: "center",
    backgroundColor: "#98d187",
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    width: "100%",
  },
  optionText: {
    color: "#000",
    fontSize: 16,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});

export { CustomAlert, AlertOk, handleLongPress };
