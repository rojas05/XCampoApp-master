import { useState, useEffect } from "react";
import { Alert } from "react-native";

const OrderItemTimes = (orders, shouldCount = false) => {
  const timeOrder = 120;
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [timeLefts, setTimeLefts] = useState(
    orders.reduce(
      (acc, order) => ({
        ...acc,
        [order.id]: {
          timeLeft: timeOrder,
          status: "counting",
          isStarted: false,
        },
      }),
      {},
    ),
  );

  useEffect(() => {
    if (!shouldCount) return; // pausar el contador

    const timers = Object.keys(timeLefts).reduce((acc, orderId) => {
      const timer = setInterval(() => {
        setTimeLefts((prevTimeLefts) => {
          const updatedTimeLefts = { ...prevTimeLefts };
          const order = updatedTimeLefts[orderId];

          const startTimerIfNeeded = () => {
            if (
              currentOrderIndex ===
                orders.findIndex((order) => order.id === orderId) &&
              !order.isStarted
            ) {
              updatedTimeLefts[orderId].isStarted = true;
            }
          };

          const updateTimeIfStarted = () => {
            if (
              currentOrderIndex ===
                orders.findIndex((order) => order.id === orderId) &&
              order.isStarted
            ) {
              updatedTimeLefts[orderId].timeLeft -= 1;
            }
          };

          const handleOrderExpiration = () => {
            updatedTimeLefts[orderId].status = "expired";

            Alert.alert(
              "¡Aviso!",
              `El pedido ${orderId} ha vencido y está cancelado.`,
            );

            if (currentOrderIndex < orders.length - 1) {
              setCurrentOrderIndex(currentOrderIndex + 1);
            }
          };

          if (order.timeLeft > 0) {
            startTimerIfNeeded();
            updateTimeIfStarted();
          } else if (order.timeLeft === 0 && order.status === "counting") {
            handleOrderExpiration();
          }

          return updatedTimeLefts;
        });
      }, 1000);

      return { ...acc, [orderId]: timer };
    }, {});

    return () => {
      Object.values(timers).forEach((timer) => clearInterval(timer));
    };
  }, [timeLefts, currentOrderIndex, orders, shouldCount]);

  return { timeLefts, currentOrderIndex, setCurrentOrderIndex };
};

export default OrderItemTimes;
