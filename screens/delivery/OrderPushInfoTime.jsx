import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { updateStateDeliveryProducts } from "../../services/DeliveryProduct";

import theme from "../../src/theme/theme";
import { formatPrice } from "../../src/utils/constants";
import StyledButton from "../../src/styles/StyledButton";
import { updateStateOrderID } from "../../services/OrdersService";

const OrderPushInfoTime = ({
  order,
  onAccept,
  onShowAlertContain,
  onCancel,
}) => {
  const navigation = useNavigation();
  const time = 300;
  const timerRef = useRef(null);

  const [timeRemaining, setTimeRemaining] = useState(time);
  const [timerActive, setTimerActive] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [showCounter, setShowCounter] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const stops = useMemo(() => (Array.isArray(order) ? order : []), [order]);

  //Mejorar time
  useEffect(() => {
    setTimeRemaining(time);
    setTimerActive(true);
    setIsTaken(false);
    setShowCounter(true);
  }, [order]);

  useEffect(() => {
    if (!timerActive || timeRemaining <= 0 || isTaken) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleCancel();
          showTimeOutAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, isTaken]);

  const showTimeOutAlert = () => {
    Alert.alert(
      "Tiempo agotado",
      "Se agotó el tiempo para aceptar la orden",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("MapScreen");
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleReservePress = useCallback(() => {
    setTimerActive(false);
    setShowCounter(false);
  }, []);

  const handleCancel = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 50,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel();
    });
  }, [fadeAnim, translateYAnim, onCancel]);

  const handleTakeOrder = async () => {
    try {
      setIsTaken(true);
      setTimerActive(false);
      onAccept();

      const routePoints = stops.map((stop) => ({
        id: stop.idOrder,
        storageName: stop.storageName,
        userName: stop.userName,
        destinyClient: stop.destinyClient,
        startPointSeller: stop.startPointSeller,
      }));

      if (stops.length === 0) {
        console.warn("No hay órdenes para actualizar.");
        return;
      }

      await Promise.allSettled(
        stops.map((stop) => {
          updateStateDeliveryProducts(stop.idDelivery, "TOMADO");
          updateStateOrderID(stop.idOrder, "LISTA_ENVIAR");
        }),
      );

      onShowAlertContain((prev) => ({ ...prev, showAlertContain: false }));

      navigation.navigate("MapOrderNotificationDeliveryScreen", {
        routes: routePoints,
      });
    } catch (error) {
      console.error("Error general en handleTakeOrder:", error);
    }
  };

  const handleViewRoute = useCallback(() => {
    const routePoints = stops.map((stop) => ({
      idDelivery: stop.idDelivery,
      destinyClient: stop.destinyClient,
      startPointSeller: stop.startPointSeller,
    }));

    console.log(routePoints);
    navigation.navigate("MultipleRoutesScreen", { routes: routePoints });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops]);

  const handleViewOrder = (stop) => {
    navigation.navigate("DeliverOrderClient", {
      orderClient: { order: stop },
      context: " ",
    });
  };

  function sumUnitPrice() {
    return stops.reduce(
      (total, order) =>
        total +
        order.products.reduce((sum, product) => sum + product.unitPrice, 0),
      0,
    );
  }

  function sumDeliveryCost() {
    return stops.reduce((total, order) => total + order.deliveryCost, 0);
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      {showCounter && timeRemaining > 0 && (
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={[
              styles.countdownButton,
              { backgroundColor: theme.colors.yellow },
            ]}
            onPress={handleReservePress}
          >
            <Text style={styles.countdownButtonText}>
              {Math.floor(timeRemaining / 60)}:
              {String(timeRemaining % 60).padStart(2, "0")}
            </Text>
            <Text style={styles.reservationText}>Reservar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.orderInfo}>
        <Text style={styles.summaryText}>
          Tienes {stops.length} pedidos ({stops.length} paradas)
        </Text>
        <Text style={styles.summaryText}>
          Costo total de los envios:{" "}
          <Text style={styles.boldText}>
            $ {formatPrice(sumDeliveryCost())}
          </Text>
        </Text>

        <StyledButton
          green
          title={`Total pedidos a pagar $${formatPrice(sumUnitPrice())}`}
          onPress={() => {}}
        />

        <View style={styles.scrollableStopsContainer}>
          <FlatList
            data={stops}
            contentContainerStyle={styles.stopsContainer}
            keyExtractor={(item, index) => `${item.idDelivery}-${index}`}
            renderItem={({ item, index }) => (
              <StopInfo stop={item} index={index} onPress={handleViewOrder} />
            )}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <Button title="Ver Ruta" onPress={handleViewRoute} />
          {!showCounter && (
            <Button
              title={isTaken ? "Tomado" : "Tomar Pedido"}
              onPress={handleTakeOrder}
              style={!isTaken ? styles.buttonDisabled : {}}
            />
          )}
          {showCounter && (
            <Button
              title="Cancelar"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const StopInfo = ({ stop, index, onPress }) => {
  let costTotal = stop.products
    .map((item) => item.unitPrice)
    .reduce((acc, price) => acc + price, 0);

  return (
    <View style={styles.stopInfoContainer}>
      <Text style={styles.stopInfo}>
        <Text style={styles.boldText}>Parada {index + 1}: </Text>
        {stop.storageName + "\n"}
        <Text style={styles.boldText}>- Pagas: </Text>
        {"$ " + formatPrice(costTotal) + " / "}
        {stop.products.length + " productos"}
      </Text>
      <TouchableOpacity onPress={() => onPress(stop)}>
        <Text style={styles.viewLink}>Ver</Text>
      </TouchableOpacity>
    </View>
  );
};

const Button = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.greyBlack,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: theme.colors.red,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  countdownButton: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  countdownButtonText: {
    color: theme.colors.red,
    fontSize: 16,
    fontWeight: "bold",
  },
  orderInfo: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.greyMedium,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    borderWidth: 0.5,
    marginTop: 60,
    paddingTop: 20,
    padding: 10,
    width: "100%",
  },
  reservationText: {
    color: theme.colors.black,
    fontWeight: "bold",
    marginLeft: 5,
  },
  scrollableStopsContainer: {
    marginBottom: 10,
    maxHeight: 220,
  },
  stopInfo: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    paddingTop: 5,
  },
  stopInfoContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  stopsContainer: {
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  summaryText: {
    alignSelf: "center",
    color: theme.colors.textPrimary,
    fontSize: 20,
    marginBottom: 3,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  viewLink: {
    color: theme.colors.blue,
    fontSize: 18,
    fontWeight: "bold",
    marginEnd: 12,
    textDecorationLine: "underline",
  },
});

export default OrderPushInfoTime;
