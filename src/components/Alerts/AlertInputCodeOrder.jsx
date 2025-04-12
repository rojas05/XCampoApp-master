import React, { useState, useCallback } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";

import theme from "../../theme/theme";
import StyledButton from "../../styles/StyledButton";
import { CustomInput } from "../../components/InputCustom";

import { deCodeGenerateDelivery } from "../../../funcions/KeyOrder";
import { getDeliveryOrderById } from "../../../services/DeliveryProduct";

const useForm = (initialState) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.code.trim()) {
      newErrors.code = "El campo de verificación está vacío";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    form,
    errors,
    handleInputChange,
    validateForm,
    setErrors,
    setForm,
  };
};

const AlertInputCodeOrder = ({
  navigation,
  isVisible,
  closeModal,
  sellerName,
  context = "MapOrderDeliveryScreen",
}) => {
  const [deliveryOrder, setDeliveryOrder] = useState([]);
  const [okMessage, setOkMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el loading
  const { form, errors, handleInputChange, validateForm, setErrors, setForm } =
    useForm({
      code: "",
    });

  const getOrder = useCallback(
    async (id) => {
      const existingOrder = deliveryOrder.find(
        (order) => Number(order.idOrder) === Number(id),
      );

      if (existingOrder) {
        console.log("Orden ya existe, no se añadirá.");
        setOkMessage("La orden ya está en la lista");
        return existingOrder;
      }

      try {
        const order = await getDeliveryOrderById(id);

        setDeliveryOrder((prevOrders) => [...prevOrders, order]);
        setOkMessage("Se agregó correctamente");

        return order;
      } catch (error) {
        setErrors((prev) => ({ ...prev, code: "Error al obtener la orden" }));
        console.error("Error al obtener la orden: " + error);
        return null;
      } finally {
        setIsLoading(false); // Desactivar loading al finalizar
      }
    },
    [deliveryOrder, setErrors],
  );

  const handleNavigation = () => {
    if (deliveryOrder.length > 0) {
      navigation.navigate("OrderDetail", {
        order: deliveryOrder,
        context:
          context !== "MapOrderDeliveryScreen"
            ? "deliveredNotification"
            : context,
      });
      closeModal();
    } else {
      setErrors((prev) => ({
        ...prev,
        code: "Debe ingresar un código válido",
      }));
    }
  };

  const handleConfirm = useCallback(async () => {
    if (!form.code.trim()) {
      setErrors((prev) => ({ ...prev, code: "El campo no puede estar vacío" }));
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true); // Activar loading al iniciar
    try {
      const getIdOrder = deCodeGenerateDelivery(form.code, setErrors);
      if (!getIdOrder) return;

      const order = await getOrder(getIdOrder);
      if (!order) return;

      setForm({ code: "" });
    } finally {
      setIsLoading(false); // Desactivar loading al finalizar
    }
  }, [form.code, getOrder, setErrors, validateForm, setForm]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={theme.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.text}>
            Introduce el código de la tienda {sellerName}
          </Text>
          <CustomInput
            value={form.code.toUpperCase()}
            placeholder="Ingresa código de verificación"
            onChangeText={(value) => handleInputChange("code", value)}
            errorMessage={errors.code}
            style={styles.input}
          />
          {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
          {okMessage && <Text style={styles.okText}>{okMessage}</Text>}

          <StyledButton
            yellow
            textBlack
            style={styles.buttonsContainer}
            title={
              form.code.trim()
                ? "Guardar"
                : deliveryOrder.length > 0
                  ? "Confirmar"
                  : "Confirmar"
            }
            onPress={form.code.trim() ? handleConfirm : handleNavigation}
            disabled={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginBottom: 0,
    width: "100%",
  },
  errorText: {
    color: theme.colors.red,
    marginTop: 5,
  },
  input: {
    width: "100%",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  okText: {
    color: theme.colors.greenText,
    marginTop: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default AlertInputCodeOrder;
