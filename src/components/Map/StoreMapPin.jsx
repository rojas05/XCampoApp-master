import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

import theme from "../../../src/theme/theme";

const StoreMap = ({ store, initialRegion }) => {
  const mapRef = useRef(null);

  return (
    <MapView
      style={styles.mapa}
      ref={mapRef}
      provider="google"
      mapType="hybrid"
      showsCompass={true}
      rotateEnabled={true}
      loadingEnabled={true}
      showsUserLocation={true}
      initialRegion={initialRegion}
    >
      {initialRegion && (
        <Marker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
          title={store.name_store}
          description={"Municipio o Vereda: " + store.location}
          pinColor={theme.colors.yellow}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  mapa: {
    height: "100%",
    width: "100%",
  },
});

export default StoreMap;
