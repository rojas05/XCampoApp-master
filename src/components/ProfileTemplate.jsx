import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

import StyledButtonIcon from "../styles/StyledButtonIcon";
import theme from "../theme/theme";
import { MARGINS } from "../utils/constants";

const ProfileTemplate = ({ userName, profileImage, bannerImage, role }) => {
  const getRoleBadge = (role) => {
    switch (role) {
      case "Administrador":
        return {
          color: "#81c784",
          icon: "shield-checkmark-outline",
          iconLibrary: Entypo,
        };
      case "Vendedor":
        return { color: "#fff176", icon: "shop", iconLibrary: Entypo };
      case "Cliente":
        return {
          color: "#64b5f6",
          icon: "person-outline",
          iconLibrary: Entypo,
        };
      case "Repartidor":
        return {
          color: "#ffb74d",
          icon: "truck-delivery",
          iconLibrary: MaterialCommunityIcons,
        };
      default:
        return {
          color: "#6c757d",
          icon: "help-circle-outline",
          iconLibrary: Entypo,
        };
    }
  };

  const { color, icon, iconLibrary } = getRoleBadge(role);

  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: bannerImage }} style={styles.banner} />
        <View style={styles.avatarContainer}>
          <Image
            source={
              typeof profileImage === "string" &&
              profileImage.startsWith("https")
                ? { uri: profileImage }
                : profileImage
            }
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{userName}</Text>

            <View style={styles.badge}>
              <View style={[styles.roleBadge, { backgroundColor: color }]}>
                {React.createElement(iconLibrary, {
                  name: icon,
                  size: 20,
                  color: "#000",
                  style: styles.roleIcon,
                })}
                <Text style={styles.badgeText}>{role}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          {role === "Vendedor"
            ? "Bienvenidos a nuestra tienda. Ofrecemos productos de alta calidad y un servicio excepcional."
            : role === "Repartidor"
              ? "Comprometidos con entregas rápidas y seguras. Su pedido en buenas manos."
              : "Bienvenido a tu perfil. Aquí puedes gestionar tu información personal."}
        </Text>
      </View>
    </View>
  );
};

const BtnEdit = ({ onChangeRole }) => {
  return (
    <View style={styles.horizontalButtonContainer}>
      <StyledButtonIcon
        title="Cambiar Rol"
        nameIcon="swap-horizontal-outline"
        iconLibrary={Ionicons}
        onPress={onChangeRole}
      />
    </View>
  );
};

const BtnCloseSeson = ({ onLogout }) => {
  return (
    <View style={styles.logoutButtonContainer}>
      <StyledButtonIcon
        logoutButton
        title="Cerrar Sesión"
        nameIcon="log-out-outline"
        iconLibrary={Ionicons}
        onPress={onLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderColor: theme.colors.white,
    borderRadius: 48,
    borderWidth: 4,
    height: 96,
    width: 96,
  },
  avatarContainer: { bottom: -48, left: 20, position: "absolute" },
  badge: {
    marginTop: 5,
  },
  badgeText: {
    color: theme.colors.black,
    fontWeight: "bold",
  },
  banner: { height: 200, width: "100%" },
  button: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonText: { fontSize: 14 },
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  contentContainer: { marginTop: 40, padding: 20 },
  description: { color: theme.colors.greyBlack, marginTop: 5 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  horizontalButtonContainer: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
  },
  logoutButtonContainer: {
    alignSelf: "center",
    marginBottom: MARGINS.basic + 20,
    width: "90%",
  },
  roleBadge: {
    alignContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  roleIcon: {
    marginRight: 10,
  },
  title: {
    color: theme.colors.black,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export { ProfileTemplate, BtnEdit, BtnCloseSeson };
