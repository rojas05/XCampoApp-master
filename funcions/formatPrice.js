export function formatCurrency(number) {
  if (isNaN(number)) {
    console.log(";)");
    return "$$";
  }
  // Convertir el número a un string con formato de punto cada 3 dígitos
  const formattedNumber = number
    .toFixed(0) // Eliminar decimales si los hay
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Insertar puntos cada 3 dígitos

  return `$${formattedNumber}`;
}
