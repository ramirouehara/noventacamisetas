export default function ArticuloCard({ articulo }) {
  const sinStock = !articulo.disponible

  return (
    <article className={sinStock ? 'card card--sin-stock' : 'card'}>
      <div className="card__photo">
        <img src={articulo.imagenUrl} alt={articulo.nombre} loading="lazy" />
        {sinStock && <span className="card__badge">Sin stock</span>}
      </div>
      <h2 className="card__name">{articulo.nombre}</h2>
    </article>
  )
}
