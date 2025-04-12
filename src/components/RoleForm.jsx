import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { CheckCircle, Pin } from "iconoir-react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import StyledImput from "../styles/StyledImput";
import StyledText from "../styles/StyledText";
import StyledButton from "../styles/StyledButton";
import theme from "../theme/theme";

const RoleForm = ({
  role,
  fields,
  errors,
  loading,
  onSubmit,
  onChangeText,
  photos,
  addPhoto,
  removePhoto,
  imageUploadError,
  handleLocationPress,
  locations,
}) => {
  const [routeDelivery, setRouteDelivery] = useState("");

  return (
    <View style={styles.item}>
      <View style={styles.header}>
        {role.icon}
        <StyledText bold>{role.name}</StyledText>
      </View>

      {fields.map((field, index) => {
        const handleTextChange = (newText) => onChangeText(field.name, newText);

        function addRoute(vereda) {
          if (!routeDelivery.split(",").includes(vereda)) {
            const newRoute = routeDelivery
              ? `${routeDelivery},${vereda}`
              : vereda;
            setRouteDelivery(newRoute);
            onChangeText(field.name, newRoute);
          }
        }

        return (
          <View key={index} style={styles.centerItem}>
            {field.name !== "coordinates" &&
              field.name !== "routeDelivery" &&
              field.name !== "location" && (
                <CheckCircle color={"grey"} width={30} height={30} />
              )}

            {field.name !== "coordinates" &&
              field.name !== "routeDelivery" &&
              field.name !== "location" && (
                <StyledImput
                  placeholder={field.placeholder}
                  onChangeText={handleTextChange}
                  textError={errors[field.name]}
                />
              )}

            {field.name === "routeDelivery" && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={routeDelivery}
                  onValueChange={(itemValue) => addRoute(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Seleccione las veredas que transite"
                    value=""
                    style={{ color: theme.colors.grey, fontSize: 14 }}
                  />
                  {locations.map((vereda) => (
                    <Picker.Item
                      key={vereda.id}
                      label={vereda.nombre}
                      value={vereda.nombre}
                    />
                  ))}
                </Picker>
                <Text>veredas: {routeDelivery}</Text>
              </View>
            )}

            {field.name === "location" && (
              <>
                <View style={styles.pickerContainerL}>
                  <Picker
                    onValueChange={(itemValue) => {
                      {
                        onChangeText(field.name, itemValue);
                      }
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Vereda"
                      value=""
                      style={{ color: theme.colors.grey, fontSize: 14 }}
                    />
                    {locations.map((vereda) => (
                      <Picker.Item
                        key={vereda.id}
                        label={vereda.nombre}
                        value={vereda.nombre}
                      />
                    ))}
                  </Picker>
                </View>
              </>
            )}

            {field.name === "coordinates" && (
              <>
                <CheckCircle color={"grey"} width={30} height={30} />
                <View style={styles.center}>
                  <TouchableOpacity
                    title="Agregar mi localización"
                    onPress={handleLocationPress}
                    style={styles.photoIcon}
                  >
                    <Pin width={25} height={25} color="black" />
                    {errors.coordinates ? (
                      <Text
                        style={{
                          color: theme.colors.red,
                          marginLeft: 8,
                        }}
                      >
                        {errors.coordinates}
                      </Text>
                    ) : (
                      <Text style={styles.photoName}>
                        Agregar mi localización
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      })}

      {role.name === "Vendedor" && (
        <>
          <TouchableOpacity onPress={addPhoto} style={styles.btnAddPhoto}>
            <Text
              style={{
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Agregar Foto
            </Text>
          </TouchableOpacity>

          <ScrollView style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <View style={styles.photoIcon}>
                  <Ionicons name="image-outline" size={24} color="black" />
                  <Text style={styles.photoName}>Imagen {index + 1}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removePhoto(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {imageUploadError && (
            <View style={{ margin: 10 }}>
              <StyledText
                style={{ color: theme.colors.red, textAlign: "center" }}
              >
                {imageUploadError}
              </StyledText>
            </View>
          )}
        </>
      )}

      {/* Botón con indicador de carga */}
      <StyledButton
        title={loading ? "Cargando..." : "Continuar"}
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnAddPhoto: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 8,
    marginTop: 15,
    paddingVertical: 5,
    textAlign: "center",
    width: "80%",
  },
  center: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    width: 250,
  },
  centerItem: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  header: {
    backgroundColor: theme.colors.green,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    padding: 5,
    width: 300,
  },
  item: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    borderRadius: 20,
    marginTop: 10,
    width: 300,
  },
  photoIcon: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
  },
  photoItem: {
    alignSelf: "center",
    backgroundColor: theme.colors.greenLiht,
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
    padding: 8,
  },
  photoName: {
    color: theme.colors.black,
    fontSize: 14,
    marginLeft: 10,
  },
  photosContainer: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerContainer: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    marginBottom: 50,
    width: "90%",
  },
  pickerContainerL: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    width: "90%",
  },
  removeButton: {
    marginLeft: 15,
  },
});

export default RoleForm;
