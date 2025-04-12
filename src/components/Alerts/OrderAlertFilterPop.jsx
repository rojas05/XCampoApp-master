import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import theme from "../../theme/theme";

const options = [
  { id: "ACEPTADA", label: "Aceptada" },
  { id: "CANCELADA", label: "Cancelada" },
  { id: "LISTA_ENVIAR", label: "Lista para enviar" },
  { id: "FINALIZADA", label: "Finalizada" },
];

const FilterPopup = ({ visible, onClose, currentFilter, onSelect }) => {
  const handleSelect = useCallback(
    (id) => {
      onSelect(id);
      onClose();
    },
    [onSelect, onClose],
  );

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.filterOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.filterPopup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterOption,
              currentFilter === option.id && styles.filterOptionSelected,
            ]}
            onPress={() => handleSelect(option.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterOptionText,
                currentFilter === option.id && styles.filterOptionTextSelected,
              ]}
            >
              {option.label}
            </Text>

            {currentFilter === option.id && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.green}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterOption: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.greenLiht,
  },
  filterOptionText: {
    color: theme.colors.black,
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: theme.colors.green,
    fontWeight: "600",
  },
  filterOverlay: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  filterPopup: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    elevation: 5,
    marginHorizontal: 16,
    marginTop: 45,
    padding: 8,
    position: "absolute",
    right: -20,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 200,
  },
});

export default FilterPopup;
