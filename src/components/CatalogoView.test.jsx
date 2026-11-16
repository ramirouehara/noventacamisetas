import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import CatalogoView, { EMPTY_MESSAGE, ERROR_MESSAGE } from './CatalogoView.jsx'

const render = (props) => renderToStaticMarkup(<CatalogoView {...props} />)

const boca = { id: '1', nombre: 'Camiseta Boca Juniors titular', disponible: true, imagenUrl: 'https://cdn.test/boca.jpg' }
const chelsea = { id: '2', nombre: 'Camiseta Chelsea alternativa negra', disponible: false, imagenUrl: 'https://cdn.test/chelsea.jpg' }

describe('CatalogoView', () => {
  it('shows a loading message while the catalog loads', () => {
    expect(render({ status: 'loading' })).toContain('Cargando artículos…')
  })

  it('shows an error message when the catalog cannot be loaded', () => {
    expect(render({ status: 'error' })).toContain(ERROR_MESSAGE)
  })

  it('shows the exact empty message when there are no articles', () => {
    expect(EMPTY_MESSAGE).toBe('Por ahora no hay artículos cargados. Escribinos por WhatsApp.')
    expect(render({ status: 'ready', articulos: [] })).toContain(EMPTY_MESSAGE)
  })

  it('shows each article with its photo and name, in the order received', () => {
    const html = render({ status: 'ready', articulos: [boca, chelsea] })

    expect(html).toContain('src="https://cdn.test/boca.jpg"')
    expect(html).toContain('alt="Camiseta Boca Juniors titular"')
    expect(html.indexOf(boca.nombre)).toBeLessThan(html.indexOf(chelsea.nombre))
  })

  it('marks only the out of stock articles with the "Sin stock" label and the dimmed style', () => {
    const html = render({ status: 'ready', articulos: [boca, chelsea] })

    expect(html.match(/Sin stock/g)).toHaveLength(1)
    expect(html.match(/card--sin-stock/g)).toHaveLength(1)
    expect(html.indexOf('card--sin-stock')).toBeGreaterThan(html.indexOf(boca.nombre))
  })
})
