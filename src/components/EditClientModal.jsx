import { Pin } from "iconoir-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import theme from "../theme/theme";

const EditClientModal = ({
  visible,
  client,
  onClose,
  onSave,
  handleLocationPress,
}) => {
  const [clientData, setClientData] = useState(client);

  const handleChange = (field, value) => {
    setClientData({ ...clientData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(clientData);
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Cliente</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={clientData.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <Text style={styles.label}>Ubicación</Text>
          <View>
            <TouchableOpacity
              title="Agregar mi localización"
              onPress={handleLocationPress}
            >
              <Pin width={25} height={25} color="black" />
              <Text style={styles.photoName}>Agregar mi localización</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Descripción de Ubicación</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={clientData.location_description}
            onChangeText={(text) => handleChange("location_description", text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: { alignItems: "center", borderRadius: 5, padding: 10, width: "45%" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonText: { color: theme.colors.white, fontWeight: "bold" },
  cancelButton: { backgroundColor: theme.colors.greyMedium },
  input: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    padding: 8,
  },
  label: { fontSize: 14, marginTop: 10 },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundColorBlack,
    flex: 1,
    justifyContent: "center",
  },
  saveButton: { backgroundColor: theme.colors.blue },
  textArea: { height: 60 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});

export default EditClientModal;
