import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../theme/theme";

const OrderCancelModal = ({ isVisible, onConfirm, orderId, closeModal }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.text}>
            Si Cancelas el pedido te afectara en tus proximas ordenes {"\n"}
            ¿Estás seguro de que deseas cancelar el pedido #{orderId}?
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-evenly",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: theme.colors.redLinht,
    borderRadius: 5,
    marginRight: 10,
    padding: 10,
    width: "45%",
  },
  confirmButton: {
    backgroundColor: theme.colors.redLinht,
    borderRadius: 5,
    padding: 10,
    width: "45%",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundColor,
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default OrderCancelModal;
