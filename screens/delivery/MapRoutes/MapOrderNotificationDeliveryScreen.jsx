import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

/* Funtion */
import {
  openGoogleMaps,
  getCoordinates,
  startTrackingLocation,
  stopTrackingLocation,
  getSavedLocation,
} from "../../../funcions/getCoordinates";
import { useRoutes } from "../context/RoutesContext";
/* Utils */
import theme from "../../../src/theme/theme";
import strings from "../../../src/string/string";
import StyledButton from "../../../src/styles/StyledButton";
import StyledButtonIcon from "../../../src/styles/StyledButtonIcon";
import { HOME_STYLES, ICON_COLORS_MAP } from "../../../src/utils/constants";
/* Components */
import MapOrderComponent from "../../../src/components/Map/MapOrderComponent";
import AlertInputCodeOrder from "../../../src/components/Alerts/AlertInputCodeOrder";
import AlertComponentOrderClient from "../../../src/components/Alerts/AlertComponentOrderClient";
import AlertGoDestinyClient from "../../../src/components/Alerts/AlertGoDestinyClient";

const MAP_TYPES = ["standard", "hybrid", "terrain"];

const MapOrderNotificationDeliveryScreen = ({ navigation }) => {
  const route = useRoute();
  const mapRef = useRef(null);
  const { setRoutes, routesState } = useRoutes();

  const [mapState, setMapState] = useState({
    mapTypeIndex: 0,
    colorMaker: ICON_COLORS_MAP.standard,
    origin: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.03,
    },
    destinations: [],
    isLoading: true,
  });
  const [alertState, setAlertState] = useState({
    showAlert: false,
    showAlertCode: false,
    showAlertClientDestiny: false,
    showOrderDestiny: true,
  });

  useEffect(() => {
    const handleBackPress = () => {
      Alert.alert(
        "Acción no permitida",
        "No se puede regresar, ya que esto comprometería los datos.",
        [{ text: "OK" }],
      );
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  useEffect(() => {
    if (!routesState.current) {
      const { routes } = route.params || {};
      if (routes) {
        setRoutes(routes); // Aquí se inicializa el contexto por única vez
      }
    }
  }, [route.params, routesState, setRoutes]);

  useEffect(() => {
    const fetchLocations = async () => {
      let originLocation;

      if (!routesState.current) {
        originLocation = await getSavedLocation(setMapState);
      } else if (routesState.completed.length > 0) {
        originLocation =
          routesState.completed[routesState.completed.length - 1].location;
      } else {
        originLocation = routesState.current.location;
      }

      await fetchCoordinates(originLocation);

      const destinationsSource =
        routesState.phase === "seller"
          ? routesState.pendingSellers
          : routesState.pendingClients;

      updateDestinations(destinationsSource);
    };

    const updateDestinations = async (destinationsSource) => {
      if (destinationsSource.length === 0) return;

      const destinations = await Promise.all(
        destinationsSource.map(async (route, index) => {
          const coordinates = await getCoordinates(route.location);
          return {
            ...coordinates,
            color: routesState.phase === "seller" ? "red" : "blue",
            title: `${routesState.phase === "seller" ? "Tienda" : "Cliente"} ${index + 1}`,
          };
        }),
      );

      setMapState((prev) => ({
        ...prev,
        origin: destinations.length > 0 ? destinations[0] : prev.origin,
        destinations,
        isLoading: false,
      }));
    };

    fetchLocations();
  }, [routesState]);

  useFocusEffect(
    React.useCallback(() => {
      startTrackingLocation(setMapState);
      return () => stopTrackingLocation();
    }, []),
  );

  const fetchCoordinates = async (locationData) => {
    if (!locationData) return;

    const coordinates = await getCoordinates(locationData);
    if (coordinates?.latitude && coordinates?.longitude) {
      setMapState((prev) => ({
        ...prev,
        origin: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: coordinates.latitudeDelta,
          longitudeDelta: coordinates.longitudeDelta,
        },
      }));
    }
  };

  const changeMapType = () => {
    setMapState((prev) => {
      const newIndex = (prev.mapTypeIndex + 1) % MAP_TYPES.length;
      return {
        ...prev,
        mapTypeIndex: newIndex,
        colorMaker: ICON_COLORS_MAP[MAP_TYPES[newIndex]],
      };
    });
  };

  const handleButtonPress = useCallback(async () => {
    if (routesState.phase === "seller") {
      setAlertState((prev) => ({ ...prev, showAlertCode: true }));
      return;
    }

    if (routesState.phase === "client") {
      navigation.navigate("DeliverOrderClient", {
        orderClient: routesState.destinyClientsStack,
        context: "deliveredNotification",
        isLastClient: routesState.pendingClients === 0,
      });

      if (routesState.phase !== "done") {
        setTimeout(() => {
          setAlertState((prev) => ({ ...prev, showAlertClientDestiny: true }));
        }, 500);
      }
    }
  }, [navigation, routesState]);

  function locationGoClient() {
    setAlertState((prev) => ({
      ...prev,
      showAlertClientDestiny: true,
      showOrderDestiny: false,
    }));
  }

  const handleArriveAtStorage = useCallback(() => {
    if (
      routesState.phase === "seller" &&
      routesState.pendingSellers.length > 0
    ) {
      setAlertState((prev) => ({ ...prev, showAlertCode: true }));
    }
  }, [routesState.pendingSellers, routesState.phase]);

  if (mapState.isLoading) return <LoadingIndicator />;

  return (
    <View style={HOME_STYLES.container}>
      <MapOrderComponent
        mapRef={mapRef}
        origin={mapState.origin}
        destinations={mapState.destinations}
        showMultipleRoutes={true}
        stateNotification={routesState}
        colorMaker={mapState.colorMaker}
        mapType={MAP_TYPES[mapState.mapTypeIndex]}
      />

      <FloatingActionButtons
        onMapTypeChange={changeMapType}
        onOpenGoogleMaps={() =>
          openGoogleMaps(
            mapState.origin,
            mapState.destinations[routesState.current.location],
          )
        }
      />

      {!alertState.showOrderDestiny && (
        <StyledButton
          green
          style={styles.bottomButton}
          title={
            routesState.phase === "seller"
              ? strings.MapBtn.arriveAtStore
              : strings.MapBtn.arriveAtClient
          }
          onPress={handleButtonPress}
        />
      )}

      {alertState.showAlertClientDestiny &&
        routesState.destinyClientsStack.length > 0 && (
          <View style={theme.overlay}>
            <AlertGoDestinyClient
              orders={routesState.destinyClientsStack}
              isVisible={() =>
                setAlertState((prev) => ({
                  ...prev,
                  showAlertClientDestiny: false,
                }))
              }
              index={routesState.currentIndex}
            />
          </View>
        )}

      {routesState.phase === "client" && alertState.showOrderDestiny && (
        <View style={styles.orderInfoContainer}>
          <AlertComponentOrderClient
            orders={routesState.destinyClientsStack}
            onPress={locationGoClient}
          />
        </View>
      )}

      {routesState.phase === "seller" &&
        routesState.pendingSellers.length > 0 && (
          <StyledButton
            green
            style={styles.bottomButton}
            title={`Llegué a ${routesState.current.storageName}`}
            onPress={handleArriveAtStorage}
          />
        )}

      {alertState.showAlertCode && (
        <AlertInputCodeOrder
          navigation={navigation}
          isVisible={alertState.showAlertCode}
          closeModal={() =>
            setAlertState((prev) => ({ ...prev, showAlertCode: false }))
          }
          sellerName={routesState.current.storageName}
          context="deliveredNotification"
        />
      )}
    </View>
  );
};

const FloatingActionButtons = ({ onMapTypeChange, onOpenGoogleMaps }) => (
  <View style={styles.floatingButtons}>
    <StyledButtonIcon
      start
      title={strings.FloatingActionButtons.openGoogleMaps}
      iconLibrary={FontAwesome5}
      nameIcon="map-marked-alt"
      onPress={onOpenGoogleMaps}
    />
    <StyledButtonIcon
      start
      title={strings.FloatingActionButtons.changeMap}
      iconLibrary={FontAwesome5}
      nameIcon="layer-group"
      onPress={onMapTypeChange}
    />
  </View>
);

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.blue} />
    <Text>{strings.LoadingIndicator.loading}</Text>
    <Text>{strings.LoadingIndicator.loadingRoute}</Text>
  </View>
);

const styles = StyleSheet.create({
  bottomButton: {
    bottom: 0,
    left: 15,
    position: "absolute",
    right: 15,
  },
  floatingButtons: {
    flexDirection: "column",
    justifyContent: "flex-start",
    left: 10,
    position: "absolute",
    top: 35,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  orderInfoContainer: {
    bottom: 0,
    left: 1,
    position: "absolute",
    right: 1,
  },
});

export default MapOrderNotificationDeliveryScreen;
