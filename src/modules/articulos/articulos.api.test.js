import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../../lib/supabase.js'
import { listarCatalogo } from './articulos.api.js'

vi.mock('../../lib/supabase.js', () => ({
  supabase: { from: vi.fn(), storage: { from: vi.fn() } },
}))

const select = vi.fn()
const getPublicUrl = vi.fn((path) => ({ data: { publicUrl: `https://cdn.test/articulos/${path}` } }))

beforeEach(() => {
  vi.clearAllMocks()
  supabase.from.mockReturnValue({ select })
  supabase.storage.from.mockReturnValue({ getPublicUrl })
})

describe('listarCatalogo', () => {
  it('queries the articulos table with the columns the catalog needs', async () => {
    select.mockResolvedValue({ data: [], error: null })

    await listarCatalogo()

    expect(supabase.from).toHaveBeenCalledWith('articulos')
    expect(select).toHaveBeenCalledWith('id, nombre, imagen_path, disponible, creado_en, baja_en')
  })

  it('returns the articles sorted by R1 with the public URL of each photo', async () => {
    select.mockResolvedValue({
      data: [
        { id: '1', nombre: 'Chelsea', imagen_path: 'chelsea.jpg', disponible: false, creado_en: '2026-11-12T10:00:00Z', baja_en: null },
        { id: '2', nombre: 'Boca', imagen_path: 'boca.jpg', disponible: true, creado_en: '2026-11-10T10:00:00Z', baja_en: null },
      ],
      error: null,
    })

    const catalogo = await listarCatalogo()

    expect(supabase.storage.from).toHaveBeenCalledWith('articulos')
    expect(catalogo).toEqual([
      { id: '2', nombre: 'Boca', disponible: true, imagenUrl: 'https://cdn.test/articulos/boca.jpg' },
      { id: '1', nombre: 'Chelsea', disponible: false, imagenUrl: 'https://cdn.test/articulos/chelsea.jpg' },
    ])
  })

  it('throws when Supabase returns an error', async () => {
    select.mockResolvedValue({ data: null, error: { message: 'network down' } })

    await expect(listarCatalogo()).rejects.toThrow('Could not load the catalog: network down')
  })
})
