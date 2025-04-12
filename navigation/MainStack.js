import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Screens
import WelcomePage from "../screens/Welcome";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Hello from "../screens/Hello";
import TypeUser from "../screens/TypeUser";
import DrawerContent from "../src/components/DrawerContent";
import Splash from "../screens/Splash";
import UserProfile from "../screens/UserProfile.jsx";

// Client
import BottomTabClient from "./BottomNabClient.js";
import DetailStore from "../screens/client/DetailStore";
import DetailProduct from "../screens/client/DetailProduct";
import InfoStore from "../screens/client/InfoStore";
import ShoppingCart from "../screens/client/ShoppingCar.js";
import DetailOrder from "../screens/client/DetailOrder.js";
import Orders from "../screens/client/Orders.jsx";

// Seller
import RegisterProducts from "../screens/store/RegisterProducts";
import HomeSeller from "../screens/store/HomeSeller";

// Delivery
import MapDeliveryScreen from "../screens/delivery/Drawer/MapScreenHome.jsx";
import MapOrderDeliveryScreen from "../screens/delivery/MapRoutes/MapOrderDeliveryScreen.jsx";
import MapOrderNotificationDeliveryScreen from "../screens/delivery/MapRoutes/MapOrderNotificationDeliveryScreen.jsx";
import MultipleRoutesScreen from "../screens/delivery/MapRoutes/MapShowMultipleRoutesScreen.jsx";
import ReservedOrdersScreen from "../screens/delivery/Drawer/ReservedOrdersScreen.jsx";
import OrderAvailableScreen from "../screens/delivery/Drawer/OrderAvailableScreen.jsx";
import OrderDetail from "../screens/delivery/OrderDetailScreen.jsx";
import DeliveyProfile from "../screens/delivery/Drawer/DeliveryProfileScreen.jsx";
import DeliverOrderClient from "../screens/delivery/DeliverOrderClientScreent.jsx";

// Chats
import ChatScreen from "../screens/chats/ChatScreen";
import ChatHeader from "../screens/chats/ChatHeader";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: 280 },
        drawerType: "slide",
      }}
    >
      <Drawer.Screen
        name="MapScreen"
        component={MapDeliveryScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="OrderAvailableScreen"
        component={OrderAvailableScreen}
        options={{ title: "Pedidos Disponibles", headerTitleAlign: "center" }}
      />
      <Drawer.Screen
        name="ReservedOrdersScreen"
        component={ReservedOrdersScreen}
        options={{ title: "Pedidos Reservados", headerTitleAlign: "center" }}
      />
      <Drawer.Screen
        name="DeliveyProfile"
        component={DeliveyProfile}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, detachPreviousScreen: true }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="WelcomePage" component={WelcomePage} />
      <Stack.Screen name="Hello" component={Hello} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="TypeUser" component={TypeUser} />
      <Stack.Screen name="UserProfile" component={UserProfile} />

      {/* CLIENT */}
      <Stack.Screen name="IndexClient" component={BottomTabClient} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
      <Stack.Screen name="DetailStore" component={DetailStore} />
      <Stack.Screen name="InfoStore" component={InfoStore} />
      <Stack.Screen name="Cart" component={ShoppingCart} />
      <Stack.Screen name="OrderDetailClient" component={DetailOrder} />
      <Stack.Screen name="Orders" component={Orders} />

      {/* SELLER */}
      <Stack.Screen name="RegisterProducts" component={RegisterProducts} />
      <Stack.Screen name="HomeSeller" component={HomeSeller} />

      {/* DELIVERY */}
      <Stack.Screen
        name="MapOrderDeliveryScreen"
        component={MapOrderDeliveryScreen}
      />
      <Stack.Screen
        name="MapOrderNotificationDeliveryScreen"
        component={MapOrderNotificationDeliveryScreen}
      />
      <Stack.Screen
        name="MultipleRoutesScreen"
        component={MultipleRoutesScreen}
      />
      <Stack.Screen name="DeliverOrderClient" component={DeliverOrderClient} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="HomeDelivery" component={MainDrawer} />

      {/* CHAT */}
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <ChatHeader navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
