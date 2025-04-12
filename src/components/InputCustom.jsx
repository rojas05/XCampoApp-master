import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import theme from "../theme/theme.js";

const CustomInput = ({
  value,
  placeholder,
  onChangeText,
  errorMessage,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  style = {},
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errorMessage && styles.inputError, style]}
        value={value}
        placeholder={errorMessage || placeholder}
        placeholderTextColor={errorMessage ? "red" : "gray"}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
};

const CustomInputIcon = ({
  value,
  placeholder,
  onChangeText,
  errorMessage,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  nameIcon,
  iconLibrary: IconLibrary,
  size = 20,
  style = {},
}) => {
  return (
    <View style={[styles.containerIcon, errorMessage && styles.inputError]}>
      <TextInput
        style={[
          styles.input,
          styles.inputIcon,
          errorMessage && styles.inputError,
          style,
        ]}
        value={value}
        placeholder={errorMessage || placeholder}
        placeholderTextColor={errorMessage ? "red" : "gray"}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
      />
      <IconLibrary
        // name={nameIcon}
        width={30}
        height={30}
        color={errorMessage ? "red" : "black"}
        style={styles.icon}
      />
    </View>
  );
};

const CustomInputPrice = ({
  value,
  placeholder,
  onChangeText,
  keyboardType = "numeric",
  errorMessage,
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        styles.halfWidth,
        errorMessage && styles.inputError,
      ]}
      placeholder={errorMessage || placeholder}
      placeholderTextColor={errorMessage ? "red" : "gray"}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: "100%",
  },
  containerIcon: {
    alignItems: "center",
    borderColor: theme.colors.border || "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
  },
  halfWidth: {
    flex: 1,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    borderColor: theme.colors.border || "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: theme.colors.red,
  },
  inputIcon: {
    borderWidth: 0,
    flex: 1,
  },
});

export { CustomInput, CustomInputPrice, CustomInputIcon };
