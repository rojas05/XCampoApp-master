import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
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

// Nota: Mostar informacion del cliente al entregar el pedido (Fotos y nombre)

const MapOrderDeliveryScreen = ({ navigation }) => {
  const route = useRoute();
  const mapRef = useRef(null);
  const { destinySeller, destinyClients, context, orders } = route.params || {};

  const [mapState, setMapState] = useState({
    mapTypeIndex: 0,
    colorMaker: ICON_COLORS_MAP.standard,
    origin: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.03,
    },
    destination: {
      latitude: 0,
      longitude: 0,
    },
    currentDestinationIndex: 0,
    isLoading: true,
  });

  const [alertState, setAlertState] = useState({
    showAlert: false,
    showAlertCode: false,
    showAlertClientDestiny: false,
    showOrderDestiny: true,
  });

  const fetchCoordinates = async (locationData, key) => {
    if (!locationData) return;
    const coordinates = await getCoordinates(locationData);

    if (coordinates?.latitude && coordinates?.longitude) {
      setMapState((prev) => ({
        ...prev,
        [key]: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: key === "origin" ? coordinates.latitudeDelta : 0.01,
          longitudeDelta: key === "origin" ? coordinates.longitudeDelta : 0.01,
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

  useEffect(() => {
    const fetchLocations = async () => {
      const originLocation = await getSavedLocation(setMapState);
      await fetchCoordinates(originLocation, "origin");

      if (context === "seller" && destinySeller?.starPointDestiny) {
        setAlertState((prev) => ({ ...prev, showOrderDestiny: false }));
        await fetchCoordinates(destinySeller.starPointDestiny, "destination");
      }

      if (context === "client" && destinyClients?.length > 0) {
        await fetchCoordinates(
          destinyClients[mapState.currentDestinationIndex],
          "destination",
        );
      }

      setMapState((prev) => ({
        ...prev,
        colorMaker: ICON_COLORS_MAP.standard,
        isLoading: false,
      }));
    };

    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState.currentDestinationIndex]);

  useFocusEffect(
    React.useCallback(() => {
      startTrackingLocation(setMapState);
      return () => stopTrackingLocation();
    }, []),
  );

  const handleButtonPress = useCallback(async () => {
    if (context === "seller") {
      setAlertState((prev) => ({ ...prev, showAlertCode: true }));
      return;
    }

    if (context === "client" && destinyClients.length > 0) {
      const isLastClient =
        mapState.currentDestinationIndex + 1 >= destinyClients.length;

      navigation.navigate("DeliverOrderClient", {
        orderClient: orders[mapState.currentDestinationIndex],
        context: "delivered",
        isLastClient,
      });

      const nextIndex = mapState.currentDestinationIndex + 1;
      const nextDestination = destinyClients[nextIndex];

      const newCoordinates = await getCoordinates(nextDestination);

      setMapState((prev) => ({
        ...prev,
        destination: {
          latitude: newCoordinates.latitude,
          longitude: newCoordinates.longitude,
        },
        currentDestinationIndex: nextIndex,
      }));

      setTimeout(() => {
        setAlertState((prev) => ({ ...prev, showAlertClientDestiny: true }));
      }, 200);
    }
  }, [
    context,
    destinyClients,
    mapState.currentDestinationIndex,
    navigation,
    orders,
  ]);

  function locationGoClient() {
    setAlertState((prev) => ({
      ...prev,
      showAlertClientDestiny: true,
      showOrderDestiny: false,
    }));
  }

  if (mapState.isLoading) return <LoadingIndicator />;

  return (
    <View style={HOME_STYLES.container}>
      <MapOrderComponent
        mapRef={mapRef}
        origin={mapState.origin}
        destination={mapState.destination}
        colorMaker={mapState.colorMaker}
        mapType={MAP_TYPES[mapState.mapTypeIndex]}
      />

      <FloatingActionButtons
        onMapTypeChange={changeMapType}
        onOpenGoogleMaps={() =>
          openGoogleMaps(mapState.origin, mapState.destination)
        }
      />

      {!alertState.showOrderDestiny && (
        <StyledButton
          green
          style={styles.bottomButton}
          title={
            context === "seller"
              ? strings.MapBtn.arriveAtStore
              : strings.MapBtn.arriveAtClient
          }
          onPress={handleButtonPress}
        />
      )}

      {alertState.showAlertClientDestiny && (
        <View style={theme.overlay}>
          <AlertGoDestinyClient
            orders={orders}
            isVisible={() =>
              setAlertState((prev) => ({
                ...prev,
                showAlertClientDestiny: false,
              }))
            }
            index={mapState.currentDestinationIndex}
          />
        </View>
      )}

      {context === "client" && alertState.showOrderDestiny && (
        <View style={styles.orderInfoContainer}>
          <AlertComponentOrderClient
            orders={orders}
            onPress={locationGoClient}
          />
        </View>
      )}

      {context === "seller" && (
        <AlertInputCodeOrder
          navigation={navigation}
          isVisible={alertState.showAlertCode}
          closeModal={() =>
            setAlertState((prev) => ({ ...prev, showAlertCode: false }))
          }
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

export default MapOrderDeliveryScreen;
