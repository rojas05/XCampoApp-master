import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import API_URL from "../fetch/ApiConfig.js";
import { getData } from "../fetch/UseFetch.js";
import { fetchWithToken } from "../tokenStorage.js";

import UpdateUserModal from "../src/components/UpdateUserModal.jsx";
import theme from "../src/theme/theme.js";

const UserProfile = () => {
  const route = useRoute();
  const { idUser } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState();
  const [departaments, setDepartments] = useState();
  const [citys, setCitys] = useState();

  useEffect(() => {
    getDepartaments();
    getDataAPI(`${API_URL}user/${idUser}`, setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getDepartaments() {
    const endpoint = "firebase/departamentos";
    const { data, error } = await getData(endpoint);

    if (data) {
      setDepartments(data);
      console.log(data);
    } else if (error) {
      console.log(error);
    }
  }

  async function InitGetCitys(department) {
    console.log("Get municipio " + department);
    //setDepartment(department.nombre);
    const endpoint = "firebase/municipios/get/";
    const { data, error } = await getData(endpoint + department);

    if (data) {
      console.log(data);
      setCitys(data);
    }

    if (error) {
      console.log(error);
    }
  }

  const getDataAPI = useCallback(async (url, setData) => {
    try {
      const response = await fetchWithToken(url, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setData(data);
        InitGetCitys(data.department);
      } else {
        setData(null);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    setModalVisible(false);
    const requestBody = {
      user_id: updatedUser.user_id,
      name: updatedUser.name,
      department: updatedUser.department,
      city: updatedUser.city,
      cell: updatedUser.cell,
      email: updatedUser.email,
    };

    try {
      const response = fetchWithToken(`${API_URL}user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        console.log(response);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && departaments && citys ? (
        <View style={styles.card}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Departamento:</Text>
          <Text style={styles.value}>{user.department}</Text>

          <Text style={styles.label}>Ciudad:</Text>
          <Text style={styles.value}>{user.city}</Text>

          <Text style={styles.label}>Celular:</Text>
          <Text style={styles.value}>{user.cell}</Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.value}>{user.email}</Text>

          <UpdateUserModal
            visible={modalVisible}
            userData={user}
            onUpdate={handleUpdateUser}
            onClose={() => setModalVisible(false)}
            departments={departaments}
            citys={citys}
            onDepartament={(department) => {
              InitGetCitys(department);
            }}
          />
        </View>
      ) : (
        <ActivityIndicator></ActivityIndicator>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="✏️ Actualizar Información"
          color="#007AFF"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    marginTop: 30,
    width: "100%",
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    elevation: 3,
    padding: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  container: {
    backgroundColor: theme.colors.whiteMedium,
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignSelf: "center",
    color: theme.colors.greyDark,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: theme.colors.greyBlack,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    color: theme.colors.black,
    fontSize: 16,
    marginTop: 2,
  },
});

export default UserProfile;
