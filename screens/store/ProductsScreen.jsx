import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
/* Styles */
import StyledButtonIcon from "../../src/styles/StyledButtonIcon.jsx";
import StyledButton from "../../src/styles/StyledButton.jsx";
/* Componentes */
import TEXTS from "../../src/string/string.js";
import theme from "../../src/theme/theme.js";
import SearchBar from "../../src/components/SearchBar.jsx";
import NoDataView from "../../src/components/NotDataView.jsx";
import OrderAlert from "../../src/components/Alerts/OrderAlert.jsx";
import { formatPrice, HOME_STYLES } from "../../src/utils/constants.js";
/* Service */
import {
  listAllProductBySeller,
  deleteProductId,
} from "../../services/productService.js";
import { getSellerID } from "../../services/SellerService.js";
import { getFirstURLFromString } from "../../fetch/UseFetch.js";

const ProductsScreen = ({ route, navigation }) => {
  const { idUser } = route.params || {};
  const [products, setProducts] = useState([]);
  const [state, setState] = useState({
    alertConfig: { visible: false, type: "", message: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idSeller, setIdSeller] = useState(null);

  useEffect(() => {
    const fetchSellerID = async () => {
      const sellerID = await getSellerID(idUser);
      setIdSeller(sellerID);
    };
    fetchSellerID();
  }, [idUser]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, idSeller]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (idSeller) fetchProducts();
    });

    return unsubscribe;
  }, [navigation, idSeller, fetchProducts]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProducts = async () => {
    if (!idSeller) return;

    try {
      const listProduct = await listAllProductBySeller(idSeller);
      setProducts(listProduct);
      setLoading(false);
    } catch (error) {
      setError("Error al obtener los productos: " + error);
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigation.navigate("RegisterProducts", {
      title: `Editar Producto ${product.name}`,
      idSeller: idSeller,
      product: product,
    });
  };

  const handleSales = () => {
    alert("Ver ventas del producto");
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProductId(productId, idSeller);
      /* Show Alert */
      setState((prev) => ({
        ...prev,
        alertConfig: {
          visible: true,
          type: "error",
          message: `Se elimino un producto correctamente`,
        },
      }));
      /* List Product */
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.idProduct !== productId),
      );
    } catch (error) {
      setError("Error al eliminar el producto: " + error);
    }
  };

  return (
    <View style={HOME_STYLES.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.greenMedium} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.title}>Productos</Text>
          <SearchBar />
          {products.length < 1 ? (
            <NoDataView dataText="productos" />
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item, index) =>
                item?.idProduct?.toString() || index.toString()
              }
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 85,
              }}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onEdit={handleEdit}
                  onSales={handleSales}
                  onDelete={handleDelete}
                />
              )}
            />
          )}
        </>
      )}
      <StyledButtonIcon
        fab
        btnFab
        title="Agregar Producto"
        size={25}
        nameIcon="add-circle-outline"
        iconLibrary={MaterialIcons}
        onPress={() =>
          navigation.navigate("RegisterProducts", {
            title: TEXTS.homeSeller.ADD_PRODUCT,
            idSeller: idSeller,
          })
        }
      />
      <OrderAlert
        visible={state.alertConfig.visible}
        type={state.alertConfig.type}
        message={state.alertConfig.message}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            alertConfig: { ...prev.alertConfig, visible: false },
          }))
        }
      />
    </View>
  );
};

const ProductCard = ({ product, onEdit, onSales, onDelete }) => (
  <View style={styles.card}>
    <Image
      source={{
        uri: getFirstURLFromString(product.urlImage) || " ",
      }}
      style={styles.productImage}
    />
    <View style={styles.cardContent}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productData}>
        Unidad: <Text style={styles.pdtValue}>{product.measurementUnit}</Text>
      </Text>
      <Text style={styles.productData}>
        Precio:{" "}
        <Text style={styles.pdtValue}>${formatPrice(product.price)}</Text>
      </Text>
      <Text style={styles.productData}>
        Categoria: <Text style={styles.pdtValue}>{product.nameCategory}</Text>
      </Text>
      <Text style={styles.productData}>
        Inventario disponible:{" "}
        <Text style={styles.pdtValue}>{product.stock} Und</Text>
      </Text>

      <View style={styles.cardButtons}>
        <StyledButtonIcon
          logoutButton
          nameIcon="delete"
          iconLibrary={MaterialIcons}
          onPress={() => onDelete(product.idProduct)}
        />
        <StyledButtonIcon
          nameIcon="edit"
          iconLibrary={MaterialIcons}
          onPress={() => onEdit(product)}
        />
      </View>
      <StyledButton green style={styles.btn} title="Ventas" onPress={onSales} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 3,
    marginVertical: 0,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    elevation: 5,
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  pdtValue: {
    color: theme.colors.red,
  },
  productData: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    color: theme.colors.greyBlack,
    fontSize: 14,
    marginVertical: 8,
  },
  productImage: {
    alignSelf: "center",
    borderRadius: 8,
    height: 120,
    marginRight: 16,
    width: 120,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
});

export default ProductsScreen;
