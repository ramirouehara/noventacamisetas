import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import App from './App.jsx'

describe('App', () => {
  it('shows the store name and logo', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('Noventa Camisetas')
    expect(html).toContain('src="/logo.png"')
  })
})
