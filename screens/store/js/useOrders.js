import { useState, useEffect, useRef } from "react";
import { getOrderID } from "../../../services/OrdersService.js";
import { getSellerID } from "../../../services/SellerService.js";
import { findProductByID } from "../../../services/productService.js";

const useOrders = (idUser, activeTab, setState) => {
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idSeller, setIdSeller] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const productCache = useRef({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const sellerID = await getSellerID(idUser);
        const ordersList = await getOrderID(sellerID, activeTab);
        setIdSeller(sellerID);

        if (ordersList?.length) {
          const lastOrder = ordersList[ordersList.length - 1];
          await loadProductDetails(lastOrder.shoppingCartId.cartItems);
        }

        setOrders(ordersList);
      } catch (error) {
        setError("Error al cargar los pedidos");
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadProductDetails = async (products) => {
      try {
        const productIds = products
          .map((p) => p.productId)
          .filter((id) => !productCache.current[id]);

        if (productIds.length === 0) return;

        const details = await Promise.all(productIds.map(findProductByID));

        productIds.forEach((id, i) => (productCache.current[id] = details[i]));

        setProductDetails((prev) => ({
          ...prev,
          ...productCache.current,
        }));

        setState((prev) => ({
          ...prev,
          productDetails: { ...prev.productDetails, ...productCache.current },
        }));
      } catch (error) {
        console.error("Error loading product details:", error);
        setError("Error al cargar los detalles de los productos");
      }
    };

    fetchOrders();
  }, [idUser, activeTab, setState]);

  return { idSeller, orders, setOrders, loading, error, productDetails };
};

export default useOrders;
