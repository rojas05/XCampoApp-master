export async function validateForm(form, imagen, setErrors) {
  const newErrors = {};
  if (!form.productName) newErrors.productName = "El nombre es obligatorio.";
  if (!form.productDescription)
    newErrors.productDescription = "La descripción es obligatoria.";
  if (!form.unidad) newErrors.unidad = "La unidad es obligatoria.";
  if (!form.categoria) newErrors.categoria = "La categoría es obligatoria.";
  if (!form.productPrice) newErrors.productPrice = "El precio es obligatorio.";
  if (!form.stock) newErrors.stock = "El stock obligatorio.";
  if (imagen.length === 0)
    newErrors.imagen = "Debe seleccionar al menos una imagen.";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return false;

  return true;
}
