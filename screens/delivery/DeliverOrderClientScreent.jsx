import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { findProductByID } from "../../services/productService.js";
import { formatPrice } from "../../src/utils/constants.js";
import { useRoutes } from "./context/RoutesContext.js";
import { updateStateOrderID } from "../../services/OrdersService.js";
import { updateStateDeliveryProducts } from "../../services/DeliveryProduct.js";

import theme from "../../src/theme/theme.js";
import StyledButton from "../../src/styles/StyledButton.jsx";
import Header from "../../src/components/HeaderCustomer.jsx";
import PaymentSwitch from "../../src/components/PaymentSwitch.jsx";
import CompletedDeliveriesMessage from "../../src/components/CompletedDeliveriesMessage.jsx";

const DeliverOrderClient = ({ navigation }) => {
  const route = useRoute();
  const { routesState, markRouteAsCompleted, getPhase } = useRoutes();
  const { orderClient, context, isLastClient } = route.params;

  const [isPaid, setIsPaid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const getOrder = () => {
    if (context === "rute") return orderClient?.order;

    if (context === "delivered") return orderClient;

    if (context === "deliveredNotification")
      return orderClient[routesState.currentIndex];

    if (context === " ") return orderClient?.order;
  };
  const order = getOrder();

  const calculateTotalCost = () =>
    order.products.reduce((total, product) => total + product.unitPrice, 0);

  const totalCost = calculateTotalCost();
  const totalToPay = order.deliveryCost || NaN;
  const totalProducts = order.products?.length || NaN;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleComplet = () => {
    console.log("Entregas completadas");

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      navigation.navigate("HomeDelivery");
    }, 2500);
  };

  const handleDelivered = async () => {
    if (!isPaid) {
      Alert.alert("Pago pendiente", "No se ha pagado la orden.", [
        { text: "OK" },
      ]);
      return;
    }

    if (context === "deliveredNotification") {
      await markRouteAsCompleted();

      const currentPhase = await getPhase();
      const isDone = currentPhase === "done";

      if (isDone) {
        handleComplet();
      } else {
        handleBackPress();
      }
    }

    if (context !== "deliveredNotification") {
      if (isLastClient) {
        handleComplet();
      } else {
        handleBackPress();
      }
    }

    try {
      await updateStateDeliveryProducts(order.idDelivery, "ENTREGADO");
      await updateStateOrderID(order.idOrder, "FINALIZADA");
    } catch (error) {
      console.error("Error actualizando estado de productos:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={order?.storageName || "Detalle del pedido"}
        onBackPress={handleBackPress}
      />
      <OrderInfo order={order} totalProducts={totalProducts} />
      <ProductList order={order} />
      <OrderTotals
        totalCost={totalCost}
        totalToPay={totalToPay}
        totalProducts={totalProducts}
      />

      {context === "delivered" ||
        (context === "deliveredNotification" && (
          <PaymentSwitch isPaid={isPaid} setIsPaid={setIsPaid} />
        ))}

      {context === "delivered" || context === "deliveredNotification" ? (
        <StyledButton
          green
          title="Continuar Entregando"
          onPress={() => handleDelivered()}
        />
      ) : (
        <StyledButton green title="Volver" onPress={() => handleBackPress()} />
      )}

      <CompletedDeliveriesMessage isVisible={showAlert} />
    </View>
  );
};

const OrderInfo = ({ order, totalProducts }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoTitle}>Sr {order.userName}</Text>
    <Text style={styles.orderId}>Pedido No: ORD-{order.idDelivery}</Text>
    <Text style={styles.infoText}>Productos: {totalProducts}</Text>
  </View>
);

const ProductList = ({ order }) => {
  const screenHeight = Dimensions.get("window").height;
  const maxHeight = screenHeight * 0.44;
  return (
    <FlatList
      data={order.products}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.productList}
      style={{ maxHeight }}
    />
  );
};

const ProductCard = ({ product }) => {
  const [products, setProducts] = useState({
    name: null,
    measurementUnit: null,
    price: null,
  });

  useEffect(() => {
    const dataProducts = async () => {
      let data = await findProductByID(product.productId);
      setProducts({
        name: data.name,
        measurementUnit: data.measurementUnit,
        price: data.price,
      });
    };
    dataProducts();
  }, [product.productId]);

  return (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{products.name}</Text>
        <Divider />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productDetailText}>
          <FontAwesome name="cart-plus" size={16} color={theme.colors.green} />
          {"  "}Cantidad: {product.quantity} {products.measurementUnit}
        </Text>
        <Text style={styles.productDetailText}>
          <FontAwesome name="tag" size={16} color={theme.colors.yellow} />
          {"  "}Precio: ${formatPrice(products.price)}
        </Text>
      </View>
    </View>
  );
};

const OrderTotals = ({ totalCost, totalToPay, totalProducts }) => (
  <View style={styles.totals}>
    <TotalRow
      icon="shopping-bag"
      label={`Total de Productos: ${totalProducts}`}
    />
    <TotalRow icon="money" label={`Costo Total: $${formatPrice(totalCost)}`} />
    <TotalRow
      icon="truck"
      label={`Costo del envío: $${formatPrice(totalToPay)}`}
    />
    <TotalRow
      icon="shopping-cart"
      label={`Total a Pagar (incluye envío): $${formatPrice(totalCost + totalToPay)}`}
    />
  </View>
);

const TotalRow = ({ icon, label }) => (
  <View style={styles.row}>
    <FontAwesome name={icon} size={20} color="#333" />
    <Text style={styles.totalText}>{label}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.whiteMedium,
    flex: 1,
    padding: 20,
  },
  divider: {
    backgroundColor: theme.colors.green,
    height: 2,
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 8,
    padding: 15,
  },
  infoText: {
    color: theme.colors.black,
    fontSize: 20,
  },
  infoTitle: {
    color: theme.colors.black,
    fontSize: 22,
    fontWeight: "bold",
  },
  orderId: {
    color: theme.colors.red,
    fontSize: 20,
    fontWeight: "bold",
  },
  productCard: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.grey,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 3,
    marginVertical: 8,
    padding: 15,
  },
  productDetailText: {
    color: theme.colors.black,
    fontSize: 16,
  },
  productDetails: {
    gap: 5,
  },
  productHeader: {
    borderBottomColor: theme.colors.white,
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingBottom: 8,
  },
  productList: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  productName: {
    color: theme.colors.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  totalText: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  totals: {
    alignSelf: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    elevation: 10,
    marginVertical: 5,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});

export default DeliverOrderClient;
