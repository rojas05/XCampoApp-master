import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import OrderItem from "../OrderItemComponent";
import { HOME_STYLES } from "../../../src/utils/constants";
import LoadingView from "../../../src/components/loading";
import NoDataView from "../../../src/components/NotDataView";
/* Services */
import { getDeliveryProductsState } from "../../../services/DeliveryProduct";
import OrderItemTimes from "../js/OrderItemTimes";

const OrderAvailableScreen = () => {
  const [orders, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const getMunicipio = async () => {
      const userInfo = await SecureStore.getItemAsync("userInfo");
      if (userInfo) {
        const { city } = JSON.parse(userInfo);
        return city;
      }
    };

    const fetchOrderList = async () => {
      try {
        setIsLoading(true);

        const deliveryList = await getDeliveryProductsState(
          "disponible",
          await getMunicipio(),
        );
        setOrder(deliveryList);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderList();
  }, []);

  if (isLoading) return <LoadingView />;
  if (!orders?.length)
    return (
      <View style={HOME_STYLES.container}>
        <NoDataView dataText="envios" />
      </View>
    );

  return (
    <View style={HOME_STYLES.containerBasic}>
      <OrderComponent orders={orders} />
    </View>
  );
};

const OrderComponent = ({ orders }) => {
  const navigation = useNavigation();
  const { timeLefts } = OrderItemTimes(orders);

  const onViewOrder = (order) => {
    navigation.navigate("DeliverOrderClient", {
      orderClient: { order },
      context: " ",
    });
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.idDelivery}
      renderItem={({ item }) => (
        <OrderItem
          item={item}
          timeLeft={timeLefts[item.id]?.timeLeft}
          status={timeLefts[item.id]?.status}
          isStarted={timeLefts[item.id]?.isStarted}
          onViewOrder={onViewOrder}
          displayMode="view"
        />
      )}
    />
  );
};

export default OrderAvailableScreen;
