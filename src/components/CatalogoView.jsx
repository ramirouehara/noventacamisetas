import Header from './Header.jsx'
import ArticuloCard from './ArticuloCard.jsx'

export const EMPTY_MESSAGE = 'Por ahora no hay artículos cargados. Escribinos por WhatsApp.'
export const ERROR_MESSAGE = 'No pudimos cargar el catálogo. Probá de nuevo en un rato.'

function Content({ status, articulos }) {
  if (status === 'loading') {
    return <p className="catalogo__message" aria-busy="true">Cargando artículos…</p>
  }
  if (status === 'error') {
    return <p className="catalogo__message" role="alert">{ERROR_MESSAGE}</p>
  }
  if (articulos.length === 0) {
    return <p className="catalogo__message">{EMPTY_MESSAGE}</p>
  }
  return (
    <ul className="catalogo__grid">
      {articulos.map((articulo) => (
        <li key={articulo.id}>
          <ArticuloCard articulo={articulo} />
        </li>
      ))}
    </ul>
  )
}

// Presentational: renders whatever state it receives, so every state can be tested without Supabase.
export default function CatalogoView({ status, articulos = [] }) {
  return (
    <>
      <Header />
      <main className="catalogo">
        <Content status={status} articulos={articulos} />
      </main>
    </>
  )
}
