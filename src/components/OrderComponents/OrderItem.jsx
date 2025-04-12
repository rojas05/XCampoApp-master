import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* Services */
import { postDeliveryProduct } from "../../../services/DeliveryProduct.js";
import { generateDeliveryCode } from "../../../funcions/KeyOrder.js";

import theme from "../../theme/theme.js";
import StyledButton from "../../styles/StyledButton.jsx";
import { formatPrice } from "../../utils/constants.js";

const OrderItem = React.memo(
  ({
    order,
    idSeller,
    navigation,
    handleAcceptOrder,
    handleCancelOrder,
    setAlertVisible,
    setDeliveryCode,
    ...props
  }) => {
    const [fadeAnim] = useState(new Animated.Value(1));
    console.log("Order: " + JSON.stringify(order));

    const productsData = React.useMemo(
      () =>
        order.shoppingCartId.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      [order.shoppingCartId.cartItems],
    );

    async function acceptOrder(idOrder, totalEarnings) {
      const stockUpdated = await props.handleUpdateStock(productsData);
      if (stockUpdated === false) {
        console.warn("Stock no actualizado, no se puede aceptar el pedido.");
        return;
      }
      // Primera animación: desvanecer
      await new Promise((resolve) => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(resolve);
      });

      // Ejecutar lógica después de la animación
      await handleAcceptOrder(idOrder, totalEarnings);

      // Segunda animación: volver a aparecer
      await new Promise((resolve) => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(resolve);
      });

      await postDeliveryProduct(idOrder);
    }

    const showKeyDelivery = (idOrder) => {
      let key = generateDeliveryCode(idOrder);
      setDeliveryCode(key);
      setAlertVisible(true);
    };

    return (
      <Animated.View style={[styles.orderContainer, { opacity: fadeAnim }]}>
        <OrderHeader
          order={order}
          onChatPress={() =>
            navigation.navigate("ChatScreen", {
              idOrder: order.idOrder,
              senderId: idSeller,
              senderContext: "SELLER",
              orderStatus: order.state,
            })
          }
        />

        <Text style={styles.sectionTitle}>Productos</Text>
        <FlatList
          data={order.shoppingCartId.cartItems}
          keyExtractor={(product) => product.productId.toString()}
          renderItem={({ item: product }) => (
            <ProductItem
              product={product}
              productDetails={props.productDetails[product.productId]}
            />
          )}
        />

        {order.state === "CANCELADA" && (
          <StyledButton red disabled title="Pedido Rechazado" />
        )}

        {order.state === "ACEPTADA" && (
          <View style={styles.buttonsContainer}>
            <StyledButton
              yellowBorder
              textBlack
              onPress={() => showKeyDelivery(order.idOrder)}
              title={"Entregar\nPedido"}
            />
            <StyledButton
              greenMedium
              textBlack
              disabled
              title={`Total a Cobrar\n$${formatPrice(order.shoppingCartId.totalEarnings)}`}
            />
          </View>
        )}

        {order.state === "EN_ESPERA" && (
          <>
            <StyledButton
              yellow
              textBlack
              onPress={() =>
                acceptOrder(order.idOrder, order.shoppingCartId.totalEarnings)
              }
              title="Aceptar Pedido"
            />
            <StyledButton
              red
              onPress={() => handleCancelOrder(order.idOrder)}
              title="Rechazar Pedido"
            />
          </>
        )}

        {order.state === "LISTA_ENVIAR" ||
          (order.state === "FINALIZADA" && (
            <StyledButton
              green
              onPress={() => console.log("Ver pedido")}
              title="Ver Pedido"
            />
          ))}
      </Animated.View>
    );
  },
);
OrderItem.displayName = "OrderItem";

const OrderHeader = ({ order, onChatPress }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerInfo}>
      <Text style={styles.orderId}>Pedido No.{order.idOrder}</Text>
      <Text style={styles.orderTotal}>
        <Text style={styles.textBlack}>Total de artículos: </Text>
        {order.shoppingCartId?.cartItems?.length || 0}
      </Text>
      <Text style={styles.orderTotal}>
        <Text style={styles.textBlack}>Cliente: </Text>
        {order.shoppingCartId?.clientName}
      </Text>
      <Text style={styles.orderTotal}>
        <Text style={styles.textBlack}>Precio total: </Text>$
        {formatPrice(order.shoppingCartId.totalEarnings)}
      </Text>
      <Text style={styles.orderTotal}>
        <Text style={styles.delivery}>Repartidor: </Text>
        {order.delivery === true
          ? "Viene en camino un repartidor"
          : "A espera de un reaprtidor"}
      </Text>
    </View>

    <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
      <Ionicons
        name="chatbubble-outline"
        size={20}
        color={theme.colors.black}
      />
      <Text style={styles.buttonText}> Chat</Text>
    </TouchableOpacity>
  </View>
);

const ProductItem = React.memo(({ product, productDetails }) => {
  if (!productDetails)
    return <Text style={styles.productText}>Cargando producto...</Text>;

  const { name, measurementUnit, price } = productDetails;
  return (
    <Text style={styles.productText} key={product.productId}>
      {`- ${name} x ${measurementUnit} 
         Precio por unidad: $${formatPrice(price)}
         Cantida: ${product.quantity} ${measurementUnit} 
         Total = $${formatPrice(product.unitPrice)}`}
    </Text>
  );
});
ProductItem.displayName = "ProductItem";

const styles = StyleSheet.create({
  buttonText: {
    color: theme.colors.black,
    fontWeight: "bold",
  },
  buttonsContainer: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  chatButton: {
    alignItems: "center",
    backgroundColor: theme.colors.greenOpacity,
    borderBlockColor: theme.colors.black,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  delivery: {
    color: theme.colors.red,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  headerInfo: {
    flex: 1,
  },
  orderContainer: {
    alignSelf: "center",
    backgroundColor: theme.colors.greenLiht,
    borderColor: theme.colors.green,
    borderRadius: 8,
    borderWidth: 2,
    elevation: 3,
    marginBottom: 28,
    marginHorizontal: 15,
    padding: 12,
    width: "90%",
  },
  orderId: {
    color: theme.colors.red,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    marginBottom: 5,
  },
  productText: {
    fontSize: 14,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  textBlack: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default OrderItem;
