import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Color from "../theme/theme";
import theme from "../theme/theme";

const CustomPicker = ({ value, setValue, items, error }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  return (
    <View style={[styles.pickerContainer, error && styles.pickerError]}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => {
          setValue(itemValue);
          setShowPlaceholder(true); // Muestra el placeholder después de seleccionar
        }}
        onFocus={() => setShowPlaceholder(false)} // Oculta el placeholder al interactuar
        style={styles.picker}
      >
        {showPlaceholder && (
          <Picker.Item
            label={error || "Seleccionar Unidad"}
            value=" "
            // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
            style={{ color: error ? "red" : "gray" }}
          />
        )}
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: "100%",
  },
  pickerContainer: {
    borderColor: Color.colors.greyMedium,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
  },
  pickerError: {
    borderColor: theme.colors.red,
    borderWidth: 1,
  },
});

export default CustomPicker;
