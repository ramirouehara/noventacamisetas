import { supabase } from '../../lib/supabase.js'
import { ordenarCatalogo } from './articulos.rules.js'

const BUCKET = 'articulos'

// RLS already hides retired articles; baja_en is still selected so R1 can check it too.
export async function listarCatalogo() {
  const { data, error } = await supabase
    .from('articulos')
    .select('id, nombre, imagen_path, disponible, creado_en, baja_en')

  if (error) throw new Error(`Could not load the catalog: ${error.message}`)

  const storage = supabase.storage.from(BUCKET)

  return ordenarCatalogo(data).map(({ id, nombre, disponible, imagen_path }) => ({
    id,
    nombre,
    disponible,
    imagenUrl: storage.getPublicUrl(imagen_path).data.publicUrl,
  }))
}
