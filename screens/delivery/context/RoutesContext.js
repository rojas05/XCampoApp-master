import React, { createContext, useContext, useState, useEffect } from "react";

const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]); // Lista completa de rutas recibidas
  const [routesState, setRoutesState] = useState({
    pendingSellers: [], // Rutas pendientes para vendedores
    pendingClients: [], // Rutas pendientes para clientes
    current: null, // Ruta actual en curso
    completed: [], // Rutas ya completadas
    phase: "seller", // Estado actual ("seller" o "client")
    destinyClientsStack: [], // Lista de órdenes reclamadas por el repartidor
    currentIndex: 0,
  });

  useEffect(() => {
    if (routes.length === 0) return;

    // Separar rutas en vendedores y clientes
    const sellerRoutes = routes.map((route, index) => ({
      index: index,
      id: route.id,
      storageName: route.storageName,
      location: route.startPointSeller,
      context: "seller",
    }));

    const clientRoutes = routes.map((route, index) => ({
      index: index,
      id: route.id,
      userName: route.userName,
      location: route.destinyClient,
      context: "client",
    }));

    // Solo actualizar si las rutas han cambiado
    setRoutesState((prevState) => ({
      ...prevState,
      pendingSellers: sellerRoutes,
      pendingClients: clientRoutes,
      current:
        sellerRoutes.length > 0 ? sellerRoutes[0] : clientRoutes[0] || null,
      completed: [],
      phase: "seller",
      currentIndex: 0,
    }));
  }, [routes]); // Se actualiza solo cuando cambian las rutas

  const markRouteAsCompleted = (destinyClientsStack = []) => {
    setRoutesState((prev) => {
      if (prev.phase === "seller") {
        const remainingSellers = prev.pendingSellers.slice(1);
        const nextRoute =
          remainingSellers.length > 0
            ? remainingSellers[0]
            : prev.pendingClients[0] || null;

        return {
          ...prev,
          pendingSellers: remainingSellers,
          current: nextRoute,
          completed: prev.current
            ? [...prev.completed, prev.current]
            : prev.completed,
          phase: remainingSellers.length > 0 ? "seller" : "client",
          destinyClientsStack:
            destinyClientsStack.length > 0
              ? [...prev.destinyClientsStack, ...destinyClientsStack]
              : prev.destinyClientsStack,
        };
      } else {
        const remainingClients = prev.pendingClients.slice(1);
        const nextRoute =
          remainingClients.length > 0 ? remainingClients[0] : null;
        const isDone = remainingClients.length === 0;

        return {
          ...prev,
          pendingClients: remainingClients,
          current: nextRoute,
          completed: prev.current
            ? [...prev.completed, prev.current]
            : prev.completed,
          phase: isDone ? "done" : "client",
          currentIndex: isDone ? prev.currentIndex : prev.currentIndex + 1,
          destinyClientsStack: isDone ? [] : prev.destinyClientsStack,
        };
      }
    });
  };

  const getPhase = async () => {
    return new Promise((resolve) => {
      const unsubscribe = setRoutesState((prev) => {
        resolve(prev.phase); // Resuelve la promesa con la fase actual
        return prev;
      });

      return () => unsubscribe(); // Limpiamos la suscripción
    });
  };

  return (
    <RoutesContext.Provider
      value={{ routesState, setRoutes, markRouteAsCompleted, getPhase }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => useContext(RoutesContext);
