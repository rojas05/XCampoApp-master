import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import TabNavigator from "../../src/components/TabNavigator.jsx";
import { OrderListLength } from "./js/GetOrderProducts.js";

// Screens
import Products from "./ProductsScreen.jsx";
import Profile from "./SellerProfileScreen.jsx";
import Pedidos from "./OrdersScreen.jsx";

const HomeSeller = ({ route }) => {
  const { idUser } = route.params;
  const nummberOfOrders = OrderListLength(idUser);
  const screens = [
    {
      name: "Pedidos",
      component: Pedidos,
      options: {
        headerShown: false,
        tabBarLabel: "Pedidos",
        tabBarIcon: ({ color, size }) => (
          <Entypo name="shopping-cart" size={size} color={color} />
        ),
      },
      initialParams: { idUser },
    },
    {
      name: "Products",
      component: Products,
      options: {
        headerShown: false,
        tabBarLabel: "Productos",
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="add-shopping-cart" size={size} color={color} />
        ),
      },
      initialParams: { idUser },
    },
    {
      name: "Profile",
      component: Profile,
      options: {
        headerShown: false,
        tabBarLabel: "Perfil",
        tabBarIcon: ({ color, size }) => (
          <Entypo name="shop" size={size} color={color} />
        ),
      },
      initialParams: { idUser },
    },
  ];

  return <TabNavigator screens={screens} numberOfOrders={nummberOfOrders} />;
};

export default HomeSeller;
