const primeroDisponibles = (a, b) => Number(b.disponible) - Number(a.disponible)

const masNuevoPrimero = (a, b) => new Date(b.creado_en) - new Date(a.creado_en)

// R1: only articles that are not retired; available ones first, then out of stock,
// each group from newest to oldest. filter returns a new array, so the input stays untouched.
export function ordenarCatalogo(articulos) {
  return articulos
    .filter((a) => a.baja_en === null)
    .sort((a, b) => primeroDisponibles(a, b) || masNuevoPrimero(a, b))
}
