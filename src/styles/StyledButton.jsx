import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../theme/theme.js";

const styles = StyleSheet.create({
  green: {
    backgroundColor: theme.colors.green,
  },
  greenMedium: {
    backgroundColor: theme.colors.greenOpacity,
    borderColor: theme.colors.black,
    borderWidth: 1,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 8,
    elevation: 3,
    justifyContent: "center",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  red: {
    backgroundColor: theme.colors.red,
  },
  text: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.25,
    lineHeight: 21,
    textAlign: "center",
  },
  textBlack: {
    color: theme.colors.black,
  },
  yellow: {
    backgroundColor: theme.colors.yellow,
  },
  yellowBorder: {
    backgroundColor: theme.colors.yellow,
    borderColor: theme.colors.black,
    borderWidth: 1,
  },
});

export default function StyledButton(props) {
  const {
    title,
    onPress,
    yellow,
    yellowBorder,
    green,
    red,
    greenMedium,
    disabled,
    textBlack,
    style,
    ...restOfPro
  } = props;

  const buttonStyles = [
    styles.primaryButton,
    yellow && styles.yellow,
    yellowBorder && styles.yellowBorder,
    green && styles.green,
    greenMedium && styles.greenMedium,
    red && styles.red,
    style,
  ];

  const textStyles = [styles.text, textBlack && styles.textBlack];

  const ButtonComponent = disabled ? View : TouchableOpacity;

  return (
    <ButtonComponent
      style={buttonStyles}
      onPress={disabled ? null : onPress} // Evitar la acción si está deshabilitado
      {...restOfPro}
    >
      <Text style={textStyles}>{title}</Text>
    </ButtonComponent>
  );
}
