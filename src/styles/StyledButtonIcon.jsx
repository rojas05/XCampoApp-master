import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import { MARGINS } from "../utils/constants.js";
import theme from "../theme/theme.js";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 8,
    elevation: 5,
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 3,
    marginVertical: 10,
    padding: 15,
  },
  buttonFlexStart: {
    alignSelf: "flex-start",
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  fab: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: theme.colors.green,
    borderBottomStartRadius: 30,
    borderColor: theme.colors.greenMedium,
    borderEndEndRadius: 0,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    padding: 12,
  },
  fabLocation: {
    bottom: MARGINS.default,
    position: "absolute",
    right: 20,
  },
  green: {
    backgroundColor: theme.colors.greenMedium,
  },
  logoutButton: {
    backgroundColor: theme.colors.red,
    justifyContent: "center",
    width: "100%",
  },
  textBlack: {
    color: theme.colors.black,
  },
  yellow: {
    alignSelf: "center",
    backgroundColor: theme.colors.yellow,
    borderRadius: 5,
    width: "50%",
  },
});

export default function StyledButtonIcon(props) {
  const {
    title = " ",
    onPress,
    nameIcon,
    iconLibrary: IconLibrary,
    logoutButton,
    start,
    textBlack,
    colorIcons = theme.colors.white,
    size = 20,
    btnFab,
    fab,
    style,
    ...restOfPro
  } = props;

  const buttonStyles = [
    styles.button,
    colorIcons,
    logoutButton && styles.logoutButton,
    textBlack && styles.textBlack,
    btnFab && styles.fabLocation,
    fab && styles.fab,
    start && styles.buttonFlexStart,
    style,
  ];

  const textStyles = [styles.buttonText];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} {...restOfPro}>
      <IconLibrary
        name={nameIcon}
        size={size}
        color={colorIcons}
        style={styles.buttonIcon}
      />
      {title !== " " ? <Text style={textStyles}>{title}</Text> : null}
    </TouchableOpacity>
  );
}
