import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  BackHandler,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { FontAwesome5 } from "@expo/vector-icons";

import { GOOGLE_MAPS_KEY } from "@env";
import {
  getCoordinates,
  getSavedLocation,
} from "../../../funcions/getCoordinates";
import theme from "../../../src/theme/theme";

const MultipleRoutesScreen = ({ route, navigation }) => {
  const { routes } = route.params;
  const mapRef = useRef(null);
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const savedLocation = await getSavedLocation();
      if (savedLocation) {
        const coordinates = await getCoordinates(savedLocation);
        setUserLocation(coordinates);
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    const fetchRoutes = async () => {
      const processedRoutes = await Promise.all(
        routes.map(async (route, index) => {
          const startCoords = await getCoordinates(route.startPointSeller);
          const endCoords = await getCoordinates(route.destinyClient);
          return {
            id: route.idDelivery,
            start: startCoords,
            end: endCoords,
            color: getColor(index),
          };
        }),
      );
      setRouteData(processedRoutes);
      setLoading(false);
    };
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, userLocation]);

  useEffect(() => {
    if (routeData.length > 0) {
      const firstRoute = routeData[0];
      mapRef.current?.animateToRegion(
        {
          latitude: firstRoute.start.latitude,
          longitude: firstRoute.start.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
    }
  }, [routeData]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const getColor = useCallback((index) => {
    const colors = ["#f33322", "#3498db", "orange"];
    return colors[index % colors.length];
  }, []);

  const openGoogleMaps = useCallback(
    (start, end) => {
      const origin = `${userLocation.latitude},${userLocation.longitude}`;

      const waypoint = `${start.latitude},${start.longitude}`;

      const destination = `${end.latitude},${end.longitude}`;

      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${origin}` +
        `&destination=${destination}` +
        `&waypoints=${waypoint}` +
        `&travelmode=driving`;

      Linking.openURL(url);
    },
    [userLocation],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.blue} />
        <Text style={styles.loadingText}>Cargando rutas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de Google Maps (solo visible en modo "una por una") */}
      {viewMode !== "all" && (
        <View style={styles.topButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.googleMapsButton]}
            onPress={() => {
              if (routeData[viewMode]) {
                openGoogleMaps(
                  routeData[viewMode].start,
                  routeData[viewMode].end,
                );
              }
            }}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={20}
              color={theme.colors.white}
            />
            <Text style={styles.buttonText}>Abrir en Google Maps</Text>
          </TouchableOpacity>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: routeData[0]?.start.latitude || userLocation?.latitude || 0,
          longitude:
            routeData[0]?.start.longitude || userLocation?.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Ubicación Actual">
            <View style={styles.currentLocationMarker}>
              <FontAwesome5 name="truck" size={24} color={theme.colors.black} />
            </View>
          </Marker>
        )}
        {routeData.map(
          (route, index) =>
            (viewMode === "all" || viewMode === index) && (
              <React.Fragment key={route.id}>
                <Marker
                  coordinate={route.start}
                  title={`Inicio Pedido ${route.id}`}
                >
                  <View style={styles.markerContainer}>
                    <FontAwesome5 name="store" size={20} color={route.color} />
                  </View>
                </Marker>
                <Marker
                  coordinate={route.end}
                  title={`Destino Pedido ${route.id}`}
                >
                  <View style={styles.markerContainer}>
                    <FontAwesome5
                      name="map-marker-alt"
                      size={24}
                      color={route.color}
                    />
                  </View>
                </Marker>
                <MapViewDirections
                  origin={userLocation}
                  destination={route.start}
                  apikey={GOOGLE_MAPS_KEY}
                  strokeColor="black"
                  strokeWidth={4}
                  optimizeWaypoints={true}
                  onError={(errorMessage) =>
                    console.log(`Error en dirección: ${errorMessage}`)
                  }
                />
                <MapViewDirections
                  origin={route.start}
                  destination={route.end}
                  apikey={GOOGLE_MAPS_KEY}
                  strokeColor={route.color}
                  strokeWidth={4}
                  optimizeWaypoints={true}
                  onError={(errorMessage) =>
                    console.log(`Error en dirección: ${errorMessage}`)
                  }
                />
              </React.Fragment>
            ),
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={() => setViewMode(viewMode === "all" ? 0 : "all")}
        >
          <FontAwesome5
            name={viewMode === "all" ? "list" : "map-marked-alt"}
            size={20}
            color={theme.colors.white}
          />
          <Text style={styles.buttonText}>
            {viewMode === "all" ? "Ver una por una" : "Ver todas"}
          </Text>
        </TouchableOpacity>
        {viewMode !== "all" && (
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={() => setViewMode((prev) => (prev + 1) % routeData.length)}
          >
            <FontAwesome5
              name="arrow-right"
              size={20}
              color={theme.colors.white}
            />
            <Text style={styles.buttonText}>Siguiente Ruta</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.yellow,
    borderRadius: 25,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonContainer: {
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    left: 0,
    paddingHorizontal: 20,
    position: "absolute",
    right: 0,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  container: { flex: 1 },
  currentLocationMarker: {
    backgroundColor: theme.colors.backgroundColorWhite,
    borderRadius: 100,
    elevation: 5,
    padding: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  googleMapsButton: {
    backgroundColor: theme.colors.greenMedium,
  },
  loadingContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  loadingText: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  map: { flex: 1 },
  markerContainer: {
    backgroundColor: theme.colors.backgroundColorWhite,
    borderRadius: 20,
    elevation: 5,
    padding: 5,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  nextButton: {
    backgroundColor: theme.colors.yellow,
  },
  toggleButton: {
    backgroundColor: theme.colors.blue,
  },
  topButtonContainer: {
    alignItems: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 40,
    zIndex: 10,
  },
});

export default MultipleRoutesScreen;
