import React, { useCallback, useState } from "react";
import { View, Alert, FlatList } from "react-native";

import OrderItem from "../OrderItemComponent";
import OrderItemTimes from "../js/OrderItemTimes";
import CancelOrderAlert from "../../../src/components/Alerts/CancelOrderAlert";
import { HOME_STYLES } from "../../../src/utils/constants";

const OrderComponent = ({ orders }) => {
  const { timeLefts } = OrderItemTimes(orders, true);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const onViewOrder = useCallback((orderId) => {
    Alert.alert(`Ver Pedido: ${orderId}`);
  }, []);

  const onCancelOrder = useCallback((orderId) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  }, []);

  const handleConfirmCancel = () => {
    console.log(`Pedido ${selectedOrderId} cancelado`);
    setModalVisible(false);
    setSelectedOrderId(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrderId(null);
  };

  return (
    <View style={HOME_STYLES.containerBasic}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderItem
            item={item}
            timeLeft={timeLefts[item.id]?.timeLeft}
            status={timeLefts[item.id]?.status}
            isStarted={timeLefts[item.id]?.isStarted}
            onViewOrder={onViewOrder}
            onCancelOrder={() => onCancelOrder(item.id)}
            displayMode="both"
          />
        )}
      />
      <CancelOrderAlert
        isVisible={isModalVisible}
        orderId={selectedOrderId}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseModal}
        closeModal={handleCloseModal}
      />
    </View>
  );
};

const ReservedOrdersScreen = () => {
  const orders = [
    {
      id: "ORD-1",
      fincaName: "Finca villa nueva",
      stops: 3,
      distance: 10.4,
      userName: "Juan Pérez",
      shippingCost: 2000,
      products: [
        { id: 1, name: "Tomates", quantity: 3, price: 3000, unit: "kg" },
        { id: 2, name: "Queso", quantity: 1, price: 5000, unit: "kg" },
        { id: 3, name: "Naranjas", quantity: 1, price: 5000, unit: "kg" },
      ],
    },
    {
      id: "ORD-2",
      fincaName: "Finca villa maria",
      stops: 2,
      distance: 4.4,
      userName: "María López",
      shippingCost: 3500,
      products: [
        { id: 4, name: "Cebollas", quantity: 2, price: 2000, unit: "kg" },
        { id: 5, name: "Acelga", quantity: 1, price: 3000, unit: "kg" },
      ],
    },
  ];

  return (
    <View style={HOME_STYLES.containerBasic}>
      <OrderComponent orders={orders} />
    </View>
  );
};

export default ReservedOrdersScreen;
