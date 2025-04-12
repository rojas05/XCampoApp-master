import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
/* Services */
import {
  getSavedLocation,
  getCoordinates,
} from "../../../funcions/getCoordinates";
import useNotificationHandler from "../js/GetNotification";
/* Utils */
import theme from "../../../src/theme/theme";
import strings from "../../../src/string/string";
import StyledButtonIcon from "../../../src/styles/StyledButtonIcon";
import { HOME_STYLES, ICON_COLORS_MAP } from "../../../src/utils/constants";
/* Components */
import OrderPushInfoTime from "../OrderPushInfoTime";
import FloatingButton from "../../../src/components/FloatingButton";
import FloatingBar from "../../../src/components/FloatingBar";
import AlertGoOrder from "../../../src/components/Alerts/AlertGoOrder";
import MapComponent from "../../../src/components/Map/MapComponent";
import { getDeliveryProductsStateMaps } from "../../../services/DeliveryProduct";
import NotificationAlert from "../../../src/components/Alerts/AlertNotificationOrder";

const MAP_TYPES = ["standard", "hybrid", "terrain"];

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const route = useRoute();
  const { fromNotification } = route.params || {};
  const [selectedCities, setSelectedCities] = useState([]);

  const [mapState, setMapState] = useState({
    mapTypeIndex: 0,
    colorMaker: ICON_COLORS_MAP.standard,
    origin: null,
    isLoading: true,
  });
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState({});
  const [alertState, setAlertState] = useState({
    showAlertContain: false,
    showAlert: false,
  });
  const [userName, setUserName] = useState(null);

  const {
    acceptOrder,
    cancelOrder,
    showNotificationAlert,
    setShowNotificationAlert,
  } = useNotificationHandler(setSelectedStore, setAlertState);

  useEffect(() => {
    if (fromNotification) {
      setAlertState((prev) => ({ ...prev, showAlertContain: true }));
    }
  }, [fromNotification]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userInfo = await SecureStore.getItemAsync("userInfo");
        if (userInfo) {
          const { name, city } = JSON.parse(userInfo);
          setUserName(name);

          if (city) {
            setSelectedCities([city]);
          }
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCities.length === 0) return;

      const [savedLocation, storage] = await Promise.all([
        getSavedLocation(),
        getDeliveryProductsStateMaps(selectedCities),
      ]);

      setStores(storage);
      if (savedLocation) {
        const coordinates = await getCoordinates(savedLocation);
        setMapState((prev) => ({
          ...prev,
          origin: coordinates,
          isLoading: false,
        }));
      }
    };

    fetchData();
  }, [selectedCities]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Splash");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation]),
  );

  const handleCitiesChange = useCallback((cities) => {
    setSelectedCities(cities);
  }, []);

  const handleMarkerPress = useCallback(
    (id) => {
      const store = stores.find((s) => s.sellerId === id);

      if (store && store !== selectedStore) {
        setSelectedStore(store);
        setAlertState((prev) => ({ ...prev, showAlert: true }));
      }
    },
    [stores, selectedStore],
  );

  const changeMapType = useCallback(() => {
    setMapState((prev) => {
      const newIndex = (prev.mapTypeIndex + 1) % MAP_TYPES.length;
      return {
        ...prev,
        mapTypeIndex: newIndex,
        colorMaker: ICON_COLORS_MAP[MAP_TYPES[newIndex]],
      };
    });
  }, []);

  const handleFaceAgentPress = useCallback(() => {
    const routePoints = [
      {
        idDelivery: 1,
        destinyClient: "1.858680815581465, -76.04328633073602",
        startPointSeller: "1.8512903108752117, -76.04659977737008",
      },
      {
        idDelivery: 2,
        destinyClient: "1.858680815581465, -76.04328633073602",
        startPointSeller: "1.8529816435541395, -76.03892636136585",
      },
      {
        idDelivery: 3,
        destinyClient: "1.858680815581465, -76.04328633073602",
        startPointSeller: "1.856821346473799, -76.0396149284753",
      },
    ];

    navigation.navigate("MultipleRoutesScreen", { routes: routePoints });
  }, [navigation]);

  if (mapState.isLoading || mapState.origin === null) return renderLoading();

  return (
    <View style={HOME_STYLES.container}>
      <MapComponent
        data={stores}
        mapRef={mapRef}
        origin={mapState.origin}
        colorMaker={mapState.colorMaker}
        mapType={MAP_TYPES[mapState.mapTypeIndex]}
        onPress={handleMarkerPress}
      />
      <FloatingActionButtons
        onMapTypeChange={changeMapType}
        navigation={navigation}
      />
      <FloatingBar
        profileImage={require("../../../assets/profile/icon_perfil_delivery.jpg")}
        userName={userName || "Repartidor"}
        onCitiesChange={handleCitiesChange}
        selectedCities={selectedCities}
      />

      <FloatingButton
        btnTop
        iconLibrary={FontAwesome5}
        nameIcon="bars"
        onPress={() => navigation.openDrawer()}
      />
      <FloatingButton
        btnButton
        size={30}
        iconLibrary={MaterialCommunityIcons}
        nameIcon="face-agent"
        onPress={handleFaceAgentPress}
      />

      {alertState.showAlertContain && selectedStore && (
        <View style={styles.orderInfoContainer}>
          <MemoizedOrderPushInfoTime
            order={selectedStore}
            onAccept={acceptOrder}
            onShowAlertContain={setAlertState}
            onCancel={cancelOrder}
            showButton={false}
          />
        </View>
      )}

      {alertState.showAlert && selectedStore && (
        <View style={theme.overlay}>
          <AlertGoOrder
            order={selectedStore}
            isVisible={() =>
              setAlertState((prev) => ({ ...prev, showAlert: false }))
            }
          />
        </View>
      )}

      {showNotificationAlert && (
        <NotificationAlert
          onAccept={() => {
            acceptOrder();
            setShowNotificationAlert(false);
          }}
          onReject={() => {
            cancelOrder();
            setShowNotificationAlert(false);
          }}
        />
      )}
    </View>
  );
};

// eslint-disable-next-line react/display-name
const FloatingActionButtons = React.memo(({ onMapTypeChange }) => (
  <View style={styles.floatingButtons}>
    <StyledButtonIcon
      start
      title={strings.FloatingActionButtons.changeMap}
      iconLibrary={FontAwesome5}
      nameIcon="layer-group"
      onPress={onMapTypeChange}
    />
  </View>
));

const MemoizedOrderPushInfoTime = React.memo(OrderPushInfoTime);

const renderLoading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.blue} />
    <Text>{strings.LoadingIndicator.loading}</Text>
    <Text>{strings.LoadingIndicator.locationPermission}</Text>
  </View>
);

const styles = StyleSheet.create({
  floatingButtons: {
    bottom: 80,
    flexDirection: "column",
    justifyContent: "flex-start",
    left: 10,
    position: "absolute",
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  orderInfoContainer: {
    bottom: 83,
    left: 10,
    position: "absolute",
    right: 10,
  },
});

export default MapScreen;
