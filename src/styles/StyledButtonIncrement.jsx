import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import theme from "../theme/theme.js";

const styles = StyleSheet.create({
  plusText: {
    color: theme.black,
    fontSize: 18,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.greenMedium,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});

export default function StyledButtonIncrement(props) {
  const { text, onPress, style, ...restOfPro } = props;
  const buttonStyles = [styles.primaryButton, style];
  const textStyles = [styles.plusText];
  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} {...restOfPro}>
      <Text style={textStyles}>{text}</Text>
    </TouchableOpacity>
  );
}
