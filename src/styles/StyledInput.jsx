import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import theme from "../theme/theme";

const StyledInput = (props) => {
  const { onChangeText, value, keyboardType, placeholder, textError } = props;
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
      />
      <Text style={styles.textError}>{textError}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: theme.colors.greenMedium,
  },
  textError: {
    color: theme.colors.red,
  },
});

export default StyledInput;
