import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../theme/theme";

const { height } = Dimensions.get("window");

const OrderAlert = ({ visible, type, message, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto cerrar después de 3 segundos
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const getAlertStyle = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: theme.colors.greenLiht,
          icon: "checkmark-circle",
          iconColor: theme.colors.black,
        };
      case "error":
        return {
          backgroundColor: theme.colors.red,
          icon: "close-circle",
          iconColor: theme.colors.white,
        };
      default:
        return {
          backgroundColor: theme.colors.gray,
          icon: "information-circle",
          iconColor: theme.colors.black,
        };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: alertStyle.backgroundColor,
          },
        ]}
      >
        <View style={styles.content}>
          <Ionicons
            name={alertStyle.icon}
            size={24}
            color={alertStyle.iconColor}
          />
          <Text style={[styles.message, { color: alertStyle.iconColor }]}>
            {message}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color={alertStyle.iconColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.black,
    borderRadius: 12,
    borderWidth: 1,
    bottom: 50,
    elevation: 5,
    left: 20,
    padding: 16,
    position: "absolute",
    right: 20,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: -2, // Cambiar dirección de la sombra
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // Cambiar top por bottom
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    elevation: 5,
    height: height,
    zIndex: 1000,
  },
});

export default OrderAlert;
