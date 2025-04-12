import React from "react";
import { Text, StyleSheet } from "react-native";
import theme from "../theme/theme.js";

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  green: {
    color: theme.colors.greenText,
  },
  red: {
    color: theme.colors.red,
  },
  redBlack: {
    color: theme.colors.redBlack,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    marginStart: 5,
  },
  title: {
    fontSize: 20,
  },
  whiteButton: {
    color: theme.colors.primary,
    fontSize: 20,
    paddingStart: 5,
  },
});

export default function StyledText({
  red,
  bold,
  blue,
  title,
  children,
  green,
  redBlack,
  whiteButton,
}) {
  const textStyles = [
    styles.text,
    red && styles.red,
    bold && styles.bold,
    blue && styles.blue,
    title && styles.title,
    green && styles.green,
    redBlack && styles.redBlack,
    whiteButton && styles.whiteButton,
  ];
  return <Text style={textStyles}>{children}</Text>;
}
