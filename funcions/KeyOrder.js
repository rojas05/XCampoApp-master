export function generateDeliveryCode(idOrder) {
  const date = new Date();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const yearDigit = date.getFullYear().toString()[3]; // Último dígito del año
  const monthCode = (date.getMonth() + 1) * 2; // Mes multiplicado por 2

  // Manejo de la letra del día
  const day = date.getDate();
  const dayLetter =
    day <= 26 ? alphabet[day - 1] : `Z${alphabet[(day - 27) % 26]}`;

  return `ORD${yearDigit}${monthCode}${dayLetter}${idOrder}`;
}

export function deCodeGenerateDelivery(deliveryCode, setErrors) {
  if (!deliveryCode.startsWith("ORD")) {
    setErrors((prev) => ({ ...prev, code: "Código de entrega no válido" }));
    return null;
  }

  const codeWithoutPrefix = deliveryCode.slice(3);
  const match = codeWithoutPrefix.match(/^(\d)(\d{1,2})(Z?[A-Z])(\d+)$/);

  if (!match) {
    setErrors((prev) => ({ ...prev, code: "Formato de código inválido" }));
    return null;
  }

  const [, yearDigit, monthCode, dayLetter, idOrder] = match;

  return idOrder;
}
