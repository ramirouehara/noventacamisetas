import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import App from './App.jsx'

describe('App', () => {
  it('shows the store name and logo', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toMatch(/<h1[^>]*>Noventa Camisetas<\/h1>/)
    expect(html).toContain('src="/logo.png"')
  })
})
