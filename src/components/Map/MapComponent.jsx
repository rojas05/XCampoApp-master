import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import theme from "../../theme/theme";
import { getCoordinates } from "../../../funcions/getCoordinates";

const MapComponent = ({
  data = [],
  mapRef,
  origin,
  colorMaker,
  mapType,
  onPress,
}) => {
  const [coordinates, setCoordinates] = useState({});

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const fetchCoordinates = async () => {
      const coordsArray = await Promise.all(
        data.map(async (store) => {
          const coords = await getCoordinates(store.starPointSeller);
          return {
            id: store.sellerId,
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
        }),
      );

      const coordsMap = Object.fromEntries(
        coordsArray.map(({ id, latitude, longitude }) => [
          id,
          { latitude, longitude },
        ]),
      );

      setCoordinates(coordsMap);
    };

    fetchCoordinates();
  }, [data]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider="google"
      mapType={mapType}
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

      {/* Mostrar marcadores para cada tienda solo si showRute es false */}
      <StoreMarkers
        data={data}
        coordinates={coordinates}
        colorMaker={colorMaker}
        onPress={onPress}
      />
    </MapView>
  );
};

const MarkerComponent = ({
  coordinate,
  color,
  onPress,
  title,
  description,
  iconName,
}) => (
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
);

const StoreMarkers = ({ data, coordinates, colorMaker, onPress }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return data.map((store) => {
    const coordinate = coordinates[store.sellerId];
    if (!coordinate) return null;

    return (
      <MarkerComponent
        key={store.sellerId}
        coordinate={coordinate}
        title={store.sellerName}
        description={`Total de productos: ${store.orders.length}`}
        onPress={() => onPress(store.sellerId)}
        iconName="store"
        color={colorMaker}
      />
    );
  });
};

const styles = StyleSheet.create({
  iconBorder: {
    textShadowColor: theme.colors.black,
    textShadowOffset: { width: -1.5, height: -1 },
    textShadowRadius: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});

export default MapComponent;
