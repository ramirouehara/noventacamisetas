import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import App from './App.jsx'

// The first render must not depend on Supabase or on the .env file.
vi.mock('./modules/articulos/articulos.api.js', () => ({
  listarCatalogo: vi.fn(() => new Promise(() => {})),
}))

describe('App', () => {
  it('opens on the catalog with the store name and logo', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toMatch(/<h1[^>]*>Noventa Camisetas<\/h1>/)
    expect(html).toContain('src="/logo.png"')
    expect(html).toContain('Cargando artículos…')
  })
})
