import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import theme from "../../theme/theme";
import { GOOGLE_MAPS_KEY } from "@env";
import { GET_COLOR_RUTE } from "../../utils/constants";

const MarkerComponent = ({
  coordinate,
  color,
  onPress,
  title,
  description,
  iconName,
}) => (
  <>
    <Marker
      coordinate={coordinate}
      title={title}
      description={description}
      onPress={onPress}
    >
      <FontAwesome5
        name={iconName}
        size={25}
        color={color}
        style={styles.iconBorder}
      />
    </Marker>

    {iconName !== "truck" && (
      <Circle
        center={coordinate}
        radius={5}
        strokeColor="rgba(0, 0, 0, 0.8)"
        fillColor="rgba(255, 0, 0, 0.9)"
      />
    )}
  </>
);

const MapViewDirection = ({ origin, destination, colorMaker }) => {
  return (
    <>
      {/* Ruta Destino */}
      <MarkerComponent
        coordinate={destination}
        color={colorMaker}
        title={"Tu Destino"}
        onPress={() => {}}
        iconName="store"
      />
      {/* Mapa con Dirección */}
      <MapViewDirections
        apikey={GOOGLE_MAPS_KEY}
        origin={origin}
        destination={destination}
        strokeColor={theme.colors.green}
        strokeWidth={5}
        onError={(errorMessage) =>
          alert("No se pudo calcular la ruta: " + errorMessage)
        }
      />
    </>
  );
};

const MapComponent = ({
  mapRef,
  origin,
  destination,
  mapType,
  colorMaker,
  onPress,
  showMultipleRoutes = false,
  stateNotification,
  destinations = [],
}) => {
  return (
    <MapView
      style={styles.map}
      provider="google"
      mapType={mapType}
      ref={mapRef}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={true}
      showsCompass={true}
      rotateEnabled={true}
      initialRegion={origin}
    >
      {/* Ruta Ubicación Del Dispositivo */}
      <MarkerComponent
        coordinate={origin}
        color={theme.colors.red}
        onPress={() => {}}
        title={"Tu Ubicacion"}
        iconName="truck"
      />

      <Circle
        center={origin}
        radius={80} // Radio de 80 metros
        strokeColor={theme.colors.blue}
        fillColor="rgba(39, 245, 223, 0.34)"
      />

      {/* Mostrar múltiples rutas si showMultipleRoutes es true */}
      {showMultipleRoutes && destinations.length > 0 && (
        <>
          {destinations.map((destination, index) => (
            <React.Fragment key={index}>
              <MarkerComponent
                coordinate={destination}
                color={
                  stateNotification.phase === "client"
                    ? GET_COLOR_RUTE(index)
                    : theme.colors.red
                }
                title={
                  stateNotification.phase === "seller"
                    ? `Tienda ${stateNotification.pendingSellers[index]?.storageName || index}`
                    : `Cliente ${stateNotification.pendingClients[index]?.userName || index}`
                }
                iconName={
                  stateNotification.phase === "seller"
                    ? "store-alt"
                    : "house-user"
                }
              />
              <MapViewDirections
                origin={index === 0 ? origin : destinations[index - 1]}
                destination={destination}
                apikey={GOOGLE_MAPS_KEY}
                strokeColor={
                  stateNotification.phase === "client"
                    ? GET_COLOR_RUTE(index)
                    : theme.colors.yellow
                }
                strokeWidth={8}
              />
            </React.Fragment>
          ))}
        </>
      )}

      {/* Mostrar la ruta entre origen y destino */}
      {!showMultipleRoutes && (
        <MapViewDirection
          origin={origin}
          destination={destination}
          colorMaker={colorMaker}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  iconBorder: {
    textShadowColor: theme.colors.black,
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});

export default MapComponent;
