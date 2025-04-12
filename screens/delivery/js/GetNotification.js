import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { getDeliveryById } from "../../../services/DeliveryProduct";
import {
  navigationRef,
  getCurrentRouteName,
} from "../../../src/utils/RootNavigation";
import { Alert } from "react-native";

const useNotificationHandler = (setSelectedStore, setAlertState) => {
  const [idQueue, setIdQueue] = useState([]);
  const [currentBatch, setCurrentBatch] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const isProcessingRef = useRef(false); // Evita llamadas repetitivas

  const processNextBatch = async () => {
    if (idQueue.length === 0 || isProcessing || currentBatch.length > 0) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    // Obtener los primeros 3 IDs
    const batchIds = idQueue.slice(0, 3);

    if (batchIds.length === 0) {
      console.log("No hay más IDs en la cola. Deteniendo proceso.");
      isProcessingRef.current = false;
      setIsProcessing(false);
      return;
    }

    setCurrentBatch(batchIds);
    console.log("🔄 Procesando batch de IDs:", batchIds);

    try {
      const batchPromises = batchIds.map((id) => getDeliveryById(id));
      const batchResults = await Promise.all(batchPromises);
      const foundOrders = batchResults.filter((order) => order !== null);

      if (foundOrders.length > 0) {
        console.log("✅ Órdenes encontradas");
        setSelectedStore(foundOrders);
        setAlertState((prev) => ({ ...prev, showAlertContain: true }));
      } else {
        console.log("❌ No se encontraron órdenes en el batch");
      }
    } catch (error) {
      console.error("Error procesando batch:", error);
    } finally {
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  };

  const handleNotificationData = (data) => {
    if (data?.screen === "MapScreen" && data?.id) {
      const newIds = data.id.split(",").map(Number);
      setIdQueue((prev) => {
        const updatedQueue = new Set([...prev, ...newIds]);
        return [...updatedQueue];
      });
      console.log("📥 IDs agregados a la cola:", newIds);
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const { data } = notification.request.content;
        const currentScreen = getCurrentRouteName();
        console.log("📍 Pantalla actual:", currentScreen);

        if (data?.screen === "MapScreen" && currentScreen !== "MapScreen") {
          //setShowNotificationAlert(true);

          Alert.alert(
            "¡Nueva Orden Disponible!",
            "Tienes una nueva entrega pendiente. ¿Deseas aceptarla?",
            [
              {
                text: "No tomar",
                style: "cancel",
                onPress: () => {
                  setShowNotificationAlert(false);
                },
              },
              {
                text: "Aceptar",
                onPress: () => {
                  navigationRef.navigate("MapScreen", {
                    fromNotification: true,
                  });
                  setShowNotificationAlert(false);
                },
              },
            ],
            { cancelable: false },
          );
        }

        handleNotificationData(data);
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        console.log("[Notificación] presionada:", data);

        handleNotificationData(data);

        if (data?.screen === "MapScreen" && data?.id) {
          navigationRef.navigate("MapScreen", {
            fromNotification: true,
          });
        }
      });

    return () => responseListener.remove();
  }, []);

  useEffect(() => {
    const checkInitialNotification = async () => {
      const lastNotification =
        await Notifications.getLastNotificationResponseAsync();

      if (lastNotification) {
        const { data } = lastNotification.notification.request.content;
        console.log("[Notificación inicial detectada]:", data);

        handleNotificationData(data);

        if (data?.screen === "MapScreen" && data?.id) {
          navigationRef.navigate("MapScreen", {
            fromNotification: true,
          });
        }
      }
    };

    checkInitialNotification();
  }, []);

  useEffect(() => {
    if (!isProcessing && idQueue.length > 0 && currentBatch.length === 0) {
      processNextBatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQueue]);

  const acceptOrder = () => {
    console.log("✅ Orden aceptada, eliminando IDs restantes...");
    setIdQueue([]);
    setCurrentBatch([]);
  };

  const cancelOrder = () => {
    console.log("❌ Orden cancelada, procesando siguiente batch...");

    setIdQueue((prev) => prev.filter((id) => !currentBatch.includes(id)));
    setCurrentBatch([]);
    setAlertState((prev) => ({ ...prev, showAlertContain: false }));
    isProcessingRef.current = false;

    // Procesar el siguiente batch después de cancelar
    setTimeout(() => {
      processNextBatch();
    }, 500);
  };

  return {
    acceptOrder,
    cancelOrder,
    showNotificationAlert,
    setShowNotificationAlert,
  };
};

export default useNotificationHandler;
