import Constants from "expo-constants";
import { Dimensions } from "react-native";
import theme from "../theme/theme.js";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
export const WIDTH_SCREEN = SCREEN_WIDTH * 0.9;
export const STATUSBAR_HEIGHT = Constants.statusBarHeight;
export const MARGINS = {
  default: STATUSBAR_HEIGHT - 10,
  basic: STATUSBAR_HEIGHT,
};

export const ICON_COLORS_MAP = {
  standard: "#000",
  hybrid: "#fff",
  terrain: "#ff6347",
};

export const GET_COLOR_RUTE = (index) => {
  const colors = ["#fe857f", "#98d187", "#ff8c42"];
  return colors[index % colors.length];
};

/**
 * Formatea el precio en un formato legible con puntos como separadores de miles.
 * @param {string | number} text - El texto o número a formatear.
 * @returns {string} - Texto formateado.
 */
export const formatPrice = (text) => {
  if (!text) return "0";
  const numericText = String(text).replace(/[^0-9]/g, "");
  return numericText.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const HOME_STYLES = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey,
    paddingTop: STATUSBAR_HEIGHT,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: theme.colors.grey,
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  imageTop: {
    width: 170,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    elevation: 8,
  },
  button: {
    backgroundColor: theme.colors.success || "#98d187",
    borderRadius: 5,
    padding: 10,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
};
