export function dateTimeFormat() {
  const fecha = new Date();
  return fecha.toISOString().split("T")[0];
}
