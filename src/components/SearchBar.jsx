import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import theme from "../theme/theme";

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <MaterialIcons
          name="search"
          size={24}
          color={theme.colors.black}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar"
          placeholderTextColor={theme.colors.greyBlack}
        />
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <MaterialIcons
          name="filter-list"
          size={24}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 8,
    justifyContent: "center",
    padding: 10,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchSection: {
    alignItems: "center",
    backgroundColor: theme.colors.greenOpacity,
    borderColor: theme.colors.black,
    borderRadius: 8,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default SearchBar;
