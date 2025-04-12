import { getOrderCount } from "../../../services/OrdersService";
import { getSellerID } from "../../../services/SellerService";

export async function OrderListLength(idUser) {
  const sellerID = await getSellerID(idUser);
  const orderList = await getOrderCount(sellerID, "EN_ESPERA");

  return orderList;
}
