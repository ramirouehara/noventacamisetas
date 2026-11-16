import { useEffect, useState } from 'react'
import { listarCatalogo } from '../modules/articulos/articulos.api.js'
import CatalogoView from '../components/CatalogoView.jsx'

// Container: loads the catalog and hands the current state to the view.
export default function Catalogo() {
  const [state, setState] = useState({ status: 'loading', articulos: [] })

  useEffect(() => {
    let active = true

    listarCatalogo()
      .then((articulos) => active && setState({ status: 'ready', articulos }))
      .catch(() => active && setState({ status: 'error', articulos: [] }))

    // Ignore a late answer if the page is gone (also covers StrictMode's double effect in dev).
    return () => {
      active = false
    }
  }, [])

  return <CatalogoView status={state.status} articulos={state.articulos} />
}
