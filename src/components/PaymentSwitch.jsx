import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import theme from "../../src/theme/theme";

const PaymentSwitch = ({ isPaid, setIsPaid }) => (
  <View style={styles.checkboxContainer}>
    <Text style={styles.checkboxLabel}>¿El pedido ya está pagado?</Text>
    <Switch
      value={isPaid}
      onValueChange={setIsPaid}
      trackColor={{
        false: theme.colors.greyMedium,
        true: theme.colors.greenLiht,
      }}
      thumbColor={isPaid ? theme.colors.green : "#f4f3f4"}
    />
  </View>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.whiteMedium,
    borderRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
  },
  checkboxLabel: {
    color: theme.colors.black,
    fontSize: 16,
  },
});

export default PaymentSwitch;
