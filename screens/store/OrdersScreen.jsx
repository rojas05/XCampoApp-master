import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import theme from "../../src/theme/theme.js";
import { HOME_STYLES } from "../../src/utils/constants.js";
import useOrders from "./js/useOrders.js";
/* Services */
import { updateStateOrderID } from "../../services/OrdersService.js";
import { updateProductStock } from "../../services/productService.js";
/* Components */
import LoadingView from "../../src/components/loading.jsx";
import NoDataView from "../../src/components/NotDataView.jsx";
import TabBar from "../../src/components/TabBar/TabBarOrder.jsx";
import OrderItem from "../../src/components/OrderComponents/OrderItem.jsx";
import OrderAlert from "../../src/components/Alerts/OrderAlert.jsx";
import FilterPopup from "../../src/components/Alerts/OrderAlertFilterPop.jsx";
import OrderAlertNotStock from "../../src/components/Alerts/OrderAlertNotStock.jsx";
import OrderAlertCodeDelivey from "../../src/components/Alerts/OrderAlertCodeDelivey.jsx";
import { updateAddEarnings } from "../../services/SellerService.js";

const OrdersScreen = ({ route, navigation }) => {
  const { idUser } = route.params || {};
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("EN_ESPERA");

  const [alertVisible, setAlertVisible] = useState(false);
  const [deliveryCode, setDeliveryCode] = useState("");

  const [state, setState] = useState({
    orderAccepted: false,
    alertNotStock: { visible: false, title: "", message: "" },
    alertConfig: { visible: false, type: "", message: "" },
  });

  const { idSeller, orders, setOrders, loading, error, productDetails } =
    useOrders(idUser, activeTab, setState);

  const handleActionOrder = async (
    orderId,
    totalEarnings,
    type,
    message,
    newState,
  ) => {
    await updateStateOrderID(orderId, newState);

    if (newState === "ACEPTADA") {
      console.log("Estamos actualizando " + totalEarnings);
      await updateAddEarnings(idSeller, totalEarnings);
    }

    setState((prev) => ({
      ...prev,
      alertConfig: { visible: true, type, message },
      orderAccepted: true,
    }));

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.idOrder === orderId ? { ...order, state: newState } : order,
      ),
    );
  };

  const handleUpdateStock = async (productsData) => {
    try {
      const results = await Promise.all(
        productsData.map((data) =>
          updateProductStock(data.quantity, data.productId, idSeller),
        ),
      );
      return results.every((result) => result === true);
    } catch {
      setState((prev) => ({
        ...prev,
        alertNotStock: {
          visible: true,
          title: "Cantidad no disponible",
          message:
            "No se puede aceptar el pedido porque no tiene esa cantidad disponible. \n \n Cancela la orden o habla con el comprador.",
        },
      }));
      return false;
    }
  };

  const { alertConfig, alertNotStock } = state;

  if (error) return <Text>{error}</Text>;
  if (loading) return <LoadingView />;
  if (!orders?.length)
    return (
      <View style={HOME_STYLES.container}>
        <TabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          acceptedFilter={activeTab}
        />
        {activeTab !== "EN_ESPERA" && (
          <FilterButtons
            setShowFilter={setShowFilter}
            showFilter={showFilter}
            acceptedFilter={activeTab}
            setAcceptedFilter={setActiveTab}
          />
        )}
        <NoDataView dataText="órdenes" />
      </View>
    );

  return (
    <View style={HOME_STYLES.container}>
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        acceptedFilter={activeTab}
      />

      {activeTab === "EN_ESPERA" ? (
        <OrderList
          orders={orders.filter((o) => o.state === activeTab)}
          idSeller={idSeller}
          navigation={navigation}
          handleAcceptOrder={(idOrder, totalEarnings) =>
            handleActionOrder(
              idOrder,
              totalEarnings,
              "success",
              "Pedido aceptado exitosamente",
              "ACEPTADA",
            )
          }
          handleCancelOrder={(idOrder) =>
            handleActionOrder(
              idOrder,
              0,
              "error",
              "Pedido cancelado exitosamente",
              "CANCELADA",
            )
          }
          handleUpdateStock={(productsData) => handleUpdateStock(productsData)}
          productDetails={productDetails}
        />
      ) : (
        <>
          <FilterButtons
            setShowFilter={setShowFilter}
            showFilter={showFilter}
            acceptedFilter={activeTab}
            setAcceptedFilter={setActiveTab}
          />

          <OrderList
            orders={orders.filter((o) => o.state === activeTab)}
            navigation={navigation}
            productDetails={productDetails}
            setAlertVisible={setAlertVisible}
            setDeliveryCode={setDeliveryCode}
          />
        </>
      )}

      <OrderAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            alertConfig: { ...prev.alertConfig, visible: false },
          }))
        }
      />

      <OrderAlertNotStock
        visible={alertNotStock.visible}
        title={alertNotStock.title}
        message={alertNotStock.message}
        onAccept={() =>
          setState((prev) => ({
            ...prev,
            alertNotStock: { ...prev.alertNotStock, visible: false },
          }))
        }
      />

      <OrderAlertCodeDelivey
        visible={alertVisible}
        code={deliveryCode}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const OrderList = ({
  orders,
  idSeller,
  setAlertVisible,
  setDeliveryCode,
  ...props
}) =>
  orders.length === 0 ? (
    <NoDataView dataText="órdenes" />
  ) : (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.idOrder.toString()}
      renderItem={({ item }) => (
        <OrderItem
          order={item}
          idSeller={idSeller}
          {...props}
          setAlertVisible={setAlertVisible}
          setDeliveryCode={setDeliveryCode}
        />
      )}
    />
  );

const FilterButtons = ({
  setShowFilter,
  showFilter,
  acceptedFilter,
  setAcceptedFilter,
}) => (
  <View style={styles.filterContainer}>
    <TouchableOpacity
      style={styles.filterButton}
      onPress={() => setShowFilter(true)}
    >
      <Ionicons name="options-outline" size={20} color={theme.colors.black} />
      <Ionicons
        name="chevron-down-outline"
        size={16}
        color={theme.colors.black}
      />
    </TouchableOpacity>

    <FilterPopup
      visible={showFilter}
      currentFilter={acceptedFilter}
      onSelect={(id) => setAcceptedFilter(id)}
      onClose={() => setShowFilter(false)}
    />
  </View>
);

const styles = StyleSheet.create({
  filterButton: {
    alignItems: "center",
    backgroundColor: theme.colors.grey,
    borderColor: theme.colors.lightGray,
    borderRadius: 25,
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 0,
  },
});

export default OrdersScreen;
