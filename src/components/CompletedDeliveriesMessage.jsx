import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import theme from "../theme/theme";
import string from "../string/string";

const CompletedDeliveriesMessage = ({ isVisible }) => {
  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <FontAwesome5
            name="check-circle"
            size={50}
            color={theme.colors.green}
          />
          <Text style={styles.text}>
            {string.CompletedDeliveriesMessage.title}
          </Text>
          <Text style={styles.subText}>
            {string.CompletedDeliveriesMessage.subtitle}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  modalBackground: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundColor,
    flex: 1,
    justifyContent: "center",
  },
  subText: {
    color: theme.colors.darkGray,
    fontSize: 16,
    marginTop: 5,
  },
  text: {
    color: theme.colors.dark,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default CompletedDeliveriesMessage;
