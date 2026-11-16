import { describe, it, expect } from 'vitest'
import { ordenarCatalogo } from './articulos.rules.js'

const articulo = (nombre, { disponible = true, creado_en, baja_en = null }) => ({
  nombre,
  disponible,
  creado_en,
  baja_en,
})

const nombres = (articulos) => articulos.map((a) => a.nombre)

describe('ordenarCatalogo (R1)', () => {
  it('leaves out retired articles', () => {
    const articulos = [
      articulo('Boca', { creado_en: '2026-11-10T10:00:00Z' }),
      articulo('Como', { creado_en: '2026-11-11T10:00:00Z', baja_en: '2026-11-12T10:00:00Z' }),
    ]

    expect(nombres(ordenarCatalogo(articulos))).toEqual(['Boca'])
  })

  it('puts available articles before the ones out of stock', () => {
    const articulos = [
      articulo('Chelsea', { disponible: false, creado_en: '2026-11-12T10:00:00Z' }),
      articulo('Boca', { creado_en: '2026-11-10T10:00:00Z' }),
    ]

    expect(nombres(ordenarCatalogo(articulos))).toEqual(['Boca', 'Chelsea'])
  })

  it('sorts each group from newest to oldest', () => {
    const articulos = [
      articulo('Madrid', { creado_en: '2026-11-10T10:00:00Z' }),
      articulo('Arsenal', { disponible: false, creado_en: '2026-11-09T10:00:00Z' }),
      articulo('Boca', { creado_en: '2026-11-12T10:00:00Z' }),
      articulo('Chelsea', { disponible: false, creado_en: '2026-11-11T10:00:00Z' }),
    ]

    expect(nombres(ordenarCatalogo(articulos))).toEqual(['Boca', 'Madrid', 'Chelsea', 'Arsenal'])
  })

  it('returns an empty list when there are no articles', () => {
    expect(ordenarCatalogo([])).toEqual([])
  })

  it('does not change the list it receives', () => {
    const articulos = [
      articulo('Madrid', { creado_en: '2026-11-10T10:00:00Z' }),
      articulo('Boca', { creado_en: '2026-11-12T10:00:00Z' }),
    ]

    ordenarCatalogo(articulos)

    expect(nombres(articulos)).toEqual(['Madrid', 'Boca'])
  })
})
