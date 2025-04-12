import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import theme from "../theme/theme";

const UpdateUserModal = ({
  visible,
  userData,
  onUpdate,
  onClose,
  departments,
  citys,
  onDepartament,
}) => {
  const [updatedUser, setUpdatedUser] = useState(userData);
  const [department, setDepartment] = useState([]);

  const handleChange = (key, value) => {
    setUpdatedUser({ ...updatedUser, [key]: value });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>✏️ Editar Información</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={updatedUser.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <Picker
            selectedValue={userData.department}
            onValueChange={(itemValue) => {
              {
                handleChange("department", itemValue);
                onDepartament(itemValue);
              }
            }}
            style={styles.picker}
          >
            {departments.map((vereda) => (
              <Picker.Item
                key={vereda.id}
                label={vereda.nombre}
                value={vereda.nombre}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={userData.city}
            onValueChange={(itemValue) => {
              {
                handleChange("city", itemValue);
              }
            }}
            style={styles.picker}
          >
            {citys.map((vereda) => (
              <Picker.Item
                key={vereda.id}
                label={vereda.nombre}
                value={vereda.nombre}
              />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Celular"
            keyboardType="numeric"
            value={String(updatedUser.cell)}
            onChangeText={(text) => handleChange("cell", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            value={updatedUser.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => onUpdate(updatedUser)}
            >
              <Text style={styles.buttonText}>💾 Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>❌ Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: theme.colors.redLinht,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    backgroundColor: theme.colors.whiteMedium,
    borderColor: theme.colors.greyMedium,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: 45,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundColor,
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.whiteMedium,
    borderRadius: 12,
    elevation: 5,
    padding: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: "90%",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.blue,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    color: theme.colors.greyDark,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default UpdateUserModal;
