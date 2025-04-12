import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import theme from "../../theme/theme";

const NotificationAlert = ({ onAccept, onReject }) => {
  const [visible, setVisible] = useState(true);
  const slideAnim = new Animated.Value(-100); // Inicia fuera de la pantalla

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleAccept = () => {
    hideNotification();
    onAccept();
  };

  const handleReject = () => {
    hideNotification();
    onReject();
  };

  const hideNotification = () => {
    // Animación de salida
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>¡Nuevo Pedido!</Text>
        <Text style={styles.message}>
          Tienes un nuevo pedido, ¿deseas tomarlo?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
          >
            <Text style={styles.buttonText}>No tomar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.buttonText}>Tomar Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  acceptButton: {
    backgroundColor: theme.colors.greenMedium,
  },
  button: {
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
    minWidth: 120,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 5,
    position: "absolute",
    right: 20,
    shadowColor: theme.colors.backgroundColorBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: 20,
    width: 300,
    zIndex: 1000,
  },
  content: {
    padding: 15,
  },
  message: {
    color: theme.colors.greyBlack,
    fontSize: 14,
    marginBottom: 15,
  },
  rejectButton: {
    backgroundColor: theme.colors.whiteMedium,
    marginRight: 10,
  },
  title: {
    color: theme.colors.greyMedium,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default NotificationAlert;
