import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import theme from "../theme/theme.js";

const styles = StyleSheet.create({
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  floatingButton: {
    backgroundColor: theme.colors.green,
    borderRadius: 100,
    elevation: 5,
    padding: 15,
    position: "absolute",
  },
  positionBottom: {
    bottom: 90,
    right: 10,
  },
  positionLet: {
    left: 20,
    top: 40,
  },
});

export default function FloatingButton(props) {
  const {
    title = " ",
    onPress,
    nameIcon,
    size = 20,
    iconLibrary: IconLibrary,
    btnTop,
    btnButton,
    style,
    ...restOfPro
  } = props;

  const buttonStyles = [
    styles.floatingButton,
    btnTop && styles.positionLet,
    btnButton && styles.positionBottom,
    style,
  ];

  const textStyles = [styles.buttonText];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} {...restOfPro}>
      <IconLibrary name={nameIcon} size={size} color="#fff" />
      {title !== " " ? <Text style={textStyles}>{title}</Text> : null}
    </TouchableOpacity>
  );
}
