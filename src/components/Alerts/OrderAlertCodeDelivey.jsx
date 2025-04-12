import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import theme from "../../../src/theme/theme.js";
import StyledButton from "../../styles/StyledButton.jsx";

const OrderAlertCodeDelivery = ({ visible, code, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <MaterialCommunityIcons
          name="truck-delivery"
          size={50}
          color={theme.colors.black}
        />

        <Text style={styles.title}>Código de Entrega</Text>

        <Text style={styles.infoText}>
          Este código debe ser proporcionado al repartidor al recoger su orden.
        </Text>

        <View style={styles.codeContainer}>
          {code.split("").map((char, index) => (
            <View key={index} style={styles.codeBox}>
              <Text style={styles.codeText}>{char}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.noteText}>
          Recuerda marcar la orden con su número de pedido y nombre de cliente
        </Text>

        <StyledButton green onPress={onClose} title="Cerrar Orden" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 18,
    width: "auto",
  },
  codeBox: {
    alignItems: "center",
    backgroundColor: theme.colors.greyMedium,
    borderRadius: 8,
    elevation: 5,
    height: 40,
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 5,
    width: 35,
  },
  codeContainer: {
    flexDirection: "row",
    textAlign: "center",
  },
  codeText: {
    color: theme.colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  infoText: {
    color: theme.colors.black,
    fontSize: 17,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  noteText: {
    color: theme.colors.greyDark,
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
    marginTop: 8,
    textAlign: "center",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundColor,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default OrderAlertCodeDelivery;
