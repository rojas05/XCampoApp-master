import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Animated, Vibration } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const QuantitySelector = ({
  initialQuantity = 1,
  onChange,
  onDelete,
  cart,
  maxQuantity,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [bottonIcon, setBottonIcon] = useState("minus");

  const handlePress = (change) => {
    let newQuantity = quantity + change;

    if (newQuantity < 1) {
      if (cart === true) onDelete();
      return;
    }

    if (newQuantity > maxQuantity) return;

    Vibration.vibrate(50); // Vibración ligera
    setQuantity(newQuantity);
    onChange && onChange(newQuantity);

    // Animación de escalado
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePress(-1)} style={styles.button}>
        {quantity === 1 ? (
          <AntDesign name="delete" size={24} color="white" />
        ) : (
          <AntDesign name={bottonIcon} size={24} color="white" />
        )}
      </TouchableOpacity>

      <Animated.Text
        style={[styles.quantity, { transform: [{ scale: scaleAnim }] }]}
      >
        {quantity}
      </Animated.Text>

      <TouchableOpacity onPress={() => handlePress(1)} style={styles.button}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  quantity: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    color: "#333",
  },
};

export default QuantitySelector;
