import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { STATUSBAR_HEIGHT } from "../../src/utils/constants.js";
import theme from "../../src/theme/theme.js";

const ChatHeader = ({ navigation, clientName = "Chat" }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>Chat</Text>
          </View>
          <View>
            <Text style={styles.title}>{clientName}</Text>
            <Text style={styles.status}>Espera tu mensaje</Text>
            {/* <Text style={styles.status}>En línea</Text> */}
          </View>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="more-vert" size={24} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginRight: 10,
    width: 40,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.whiteMedium,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingTop: STATUSBAR_HEIGHT + 10,
  },
  iconButton: {
    borderRadius: 20,
    padding: 8,
  },
  leftSection: {
    alignItems: "center",
    flexDirection: "row",
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  status: {
    color: theme.colors.greyBlack,
    fontSize: 14,
  },
  title: {
    color: theme.colors.greyDark,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ChatHeader;
