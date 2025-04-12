import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import string from "../src/string/string";
import StyledText from "../src/styles/StyledText";
import StyledButton from "../src/styles/StyledButton";
import { CustomInput } from "../src/components/InputCustom";
import { saveToken } from "../tokenStorage";
import { postData, getData } from "../fetch/UseFetch";
import theme from "../src/theme/theme";

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const [citys, setCitys] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState({});
  const [cell, setCell] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [city, setCity] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getDepartament();
  }, []);

  const validateForm = async () => {
    let errors = {};

    // Validaciones
    if (!name) errors.name = string.Signup.errors.name;
    if (!cell) errors.cell = string.Signup.errors.cell;
    if (!password) errors.password = string.Signup.errors.password;
    if (password.length < 8) errors.password = string.Signup.errors.password;
    if (!mail) errors.mail = string.Signup.errors.mail;
    if (!city) errors.city = string.Signup.errors.city;

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const endpoint = "auth/register";
      const requestBody = {
        name: name,
        department: department,
        city: city,
        cell: cell,
        email: mail,
        password: password,
      };

      setLoading(true); // Activar el estado de carga

      const { data, error } = await postData(endpoint, requestBody);

      setLoading(false); // Desactivar el estado de carga

      if (data) {
        if (data.statusCode === "FORBIDDEN") {
          Alert.alert("Upss", "El correo ya existe");
          errors.mail = string.Signup.errors.mail;
        }

        if (data.statusCode === "OK") {
          try {
            await saveToken("id", data.body.id_user);
            await saveToken("accessToken", data.body.token);
            await saveToken("refreshToken", data.body.refreshToken);

            navigation.navigate("TypeUser", {
              idUser: data.body.id_user,
              roles: [],
            });
          } catch (e) {
            Alert.alert("No se logro iniciar");
            throw e;
          }
        }
      }

      if (error) {
        console.error(error);
        Alert.alert("Error al registrar", error.message);
      }
    }
  };

  async function getDepartament() {
    const endpoint = "firebase/departamentos";
    const { data, error } = await getData(endpoint);

    if (data) {
      setDepartments(data);
    }

    if (error) {
      console.error(error);
    }
  }

  async function InitGetCitys(department) {
    setDepartment(department.nombre);
    const endpoint = "firebase/municipios/";
    const { data, error } = await getData(endpoint + department.id);

    if (data) {
      setCitys(data);
    }

    if (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/XCampo.png")}
        style={styles.image}
      ></Image>

      <StyledButton
        title={string.Signup.hello}
        style={styles.Button}
      ></StyledButton>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>{string.Signup.name}:</Text>
        <CustomInput
          value={name}
          placeholder={string.Signup.name}
          onChangeText={(newText) => setName(newText)}
          errorMessage={errors.name}
        />

        <Text style={styles.text}>{string.Signup.cell}:</Text>
        <CustomInput
          value={cell}
          placeholder={string.Signup.cell}
          onChangeText={(newText) => setCell(newText)}
          errorMessage={errors.cell}
          keyboardType="numeric"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={department}
            onValueChange={(itemValue) => InitGetCitys(itemValue)}
            style={styles.picker}
          >
            <Picker.Item
              label="Departamento"
              value=""
              style={styles.pickerItem}
            />
            {departments.map((department) => (
              <Picker.Item
                key={department.id}
                label={department.nombre}
                value={department}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={city}
            onValueChange={(itemValue) => setCity(itemValue.nombre)}
            style={styles.picker}
          >
            <Picker.Item label="Municipio" value="" style={styles.pickerItem} />
            {citys.map((city) => (
              <Picker.Item key={city.id} label={city.nombre} value={city} />
            ))}
          </Picker>
        </View>

        <Text style={styles.text}>{string.Signup.mail}:</Text>
        <CustomInput
          value={mail}
          placeholder={string.Signup.mail}
          onChangeText={(newText) => setMail(newText)}
          errorMessage={errors.mail}
          keyboardType="email-address"
        />

        <Text style={styles.text}>
          {errors.password || string.Signup.password}:
        </Text>
        <CustomInput
          value={password}
          placeholder={string.Signup.password}
          onChangeText={(newText) => setPassword(newText)}
          errorMessage={errors.password}
          keyboardType="visible-password"
        />
      </View>

      <StyledText style={styles.text}>{string.Signup.require}</StyledText>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.yellow} />
      ) : (
        <StyledButton
          title={string.Signup.registrate}
          style={styles.btnRegister}
          onPress={() => {
            validateForm();
          }}
        ></StyledButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Button: {
    marginBottom: 30,
    marginTop: 30,
    width: 250,
  },
  btnRegister: {
    marginTop: 20,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  image: {
    borderRadius: 30,
    height: 100,
    width: 200,
  },
  inputContainer: {
    alignItems: "center",
    paddingHorizontal: 50,
    width: "100%",
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
    marginBottom: 10,
    width: "100%",
  },
  // eslint-disable-next-line react-native/no-color-literals
  pickerItem: {
    color: "gray",
    fontSize: 14,
  },
  text: {
    alignSelf: "flex-start",
    fontSize: 17,
    marginVertical: 3,
  },
});

export default Signup;
