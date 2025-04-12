import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SecureStore from "expo-secure-store";

import theme from "../theme/theme.js";
import StyledButtonIcon from "../styles/StyledButtonIcon.jsx";
import { STATUSBAR_HEIGHT } from "../../src/utils/constants.js";
import { getCountDeliveryAvailable } from "../../services/DeliveryProduct.js";

const DrawerContent = ({ navigation, state }) => {
  const activeRouteName = state?.routeNames[state?.index];
  const [orderCount, setOrderCount] = useState(null);
  const [userName, setUserName] = useState(null);

  const menuItems = [
    { icon: "map-marked-alt", label: "Inicio", navigation: "MapScreen" },
    {
      icon: "box",
      label: "Pedidos disponibles",
      navigation: "OrderAvailableScreen",
      badge: orderCount >= 1 ? orderCount : null,
    },
    {
      icon: "box-open",
      label: "Pedidos reservados",
      navigation: "ReservedOrdersScreen",
    },
    {
      icon: "user-alt",
      label: "Perfil",
      navigation: "DeliveyProfile",
    },
    {
      icon: "money-bill-wave",
      label: "Mis ganancias",
      navigation: "DeliveyProfile",
    },
    { icon: "exchange-alt", label: "Cambiar rol", navigation: "Splash" },
  ];

  useEffect(() => {
    const getMunicipio = async () => {
      const userInfo = await SecureStore.getItemAsync("userInfo");
      if (userInfo) {
        const { name, city } = JSON.parse(userInfo);
        setUserName(name);

        return city;
      }
    };

    const fetchOrderList = async () => {
      const totalDeliveryAvailable = await getCountDeliveryAvailable(
        await getMunicipio(),
      );

      setOrderCount(totalDeliveryAvailable);
    };
    fetchOrderList();
  }, []);

  return (
    <View style={styles.drawerContent}>
      <UserProfile name={userName} />
      <Divider />
      <MenuList
        menuItems={menuItems}
        activeRouteName={activeRouteName}
        navigation={navigation}
      />
      <Divider />
      <View style={styles.signOutSection}>
        <StyledButtonIcon
          logoutButton
          title="Cerrar sesión"
          iconLibrary={FontAwesome5}
          nameIcon="sign-out-alt"
          onPress={() => navigation.navigate("WelcomePage")}
        />
      </View>
    </View>
  );
};

const UserProfile = ({ name }) => (
  <View style={styles.profileSection}>
    <Image
      style={styles.profileImage}
      source={require("../../assets/profile/icon_perfil_delivery.jpg")}
    />
    <View style={styles.profileTextContainer}>
      <Text style={styles.greeting}>Buen día, {name}</Text>
      <Text style={styles.subText}> Bienvenido de nuevo!</Text>
      <Text style={styles.subText}> Estamos listos para trabajar</Text>
    </View>
  </View>
);

const MenuList = ({ menuItems, activeRouteName, navigation }) => (
  <View style={styles.menuItems}>
    {menuItems.map((item, index) => (
      <MenuItem
        key={index}
        item={item}
        isActive={activeRouteName === item.navigation}
        onPress={() => navigation.navigate(item.navigation)}
      />
    ))}
  </View>
);

const MenuItem = ({ item, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItem, isActive && styles.activeMenuItem]}
    onPress={onPress}
  >
    <View style={styles.iconContainer}>
      <FontAwesome5
        name={item.icon}
        size={20}
        color={isActive ? "white" : "#98d187"}
      />
      {item.badge != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{String(item.badge)}</Text>
        </View>
      )}
    </View>
    <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  activeMenuItem: {
    backgroundColor: theme.colors.green,
  },
  activeMenuText: {
    color: theme.colors.white,
  },
  badge: {
    alignItems: "center",
    backgroundColor: theme.colors.red,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: -10,
    top: -5,
    width: 20,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: theme.colors.greenMedium,
    height: 2,
    marginVertical: 10,
  },
  drawerContent: {
    backgroundColor: theme.colors.white,
    flex: 1,
    paddingEnd: 10,
    paddingStart: 15,
    paddingTop: STATUSBAR_HEIGHT + 5,
  },
  greeting: {
    color: theme.colors.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    position: "relative",
  },
  menuItem: {
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  menuItems: {
    flex: 1,
    marginTop: 10,
  },
  menuText: {
    color: theme.colors.greyBlack,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
  },
  profileImage: {
    borderColor: theme.colors.black,
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    marginRight: 5,
    width: 60,
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: theme.colors.greenLiht,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 8,
    padding: 10,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  signOutSection: {
    height: 70,
    marginBottom: 20,
  },
  subText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    paddingTop: 5,
  },
});

export default DrawerContent;
