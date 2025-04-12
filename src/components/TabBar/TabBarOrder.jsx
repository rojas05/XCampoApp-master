import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import theme from "../../theme/theme";

// Componente para el encabezado de la orden
const TabBar = ({ activeTab, setActiveTab, acceptedFilter }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "EN_ESPERA" && styles.activeTab]}
        onPress={() => setActiveTab("EN_ESPERA")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "EN_ESPERA" && styles.activeTabText,
          ]}
        >
          Pendientes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab !== "EN_ESPERA" && styles.activeTab]}
        onPress={() => setActiveTab("ACEPTADA")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab !== "EN_ESPERA" && styles.activeTabText,
          ]}
        >
          {activeTab !== "EN_ESPERA"
            ? acceptedFilter.replace("_", " ")
            : "Aceptados"}
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: theme.colors.greenLiht,
    borderLeftColor: theme.colors.green,
    borderLeftWidth: 5,
    margin: 5,
  },
  activeTabText: {
    color: theme.colors.green,
    fontWeight: "bold",
  },
  safeArea: {
    elevation: 4,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  tab: {
    alignItems: "center",
    borderBottomStartRadius: 0,
    borderRadius: 12,
    borderTopStartRadius: 0,
    flex: 1,
    paddingVertical: 15,
  },
  tabContainer: {
    backgroundColor: theme.colors.greenOpacity,
    borderRadius: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tabText: {
    color: theme.colors.gray,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default TabBar;
