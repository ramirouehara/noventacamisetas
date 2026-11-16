# Product Backlog — Catálogo Noventa Camisetas

> Versión 1 (15/11/2026). Basada en `modelo-de-dominio.md` y el pedido del cliente.

## Cómo leer este backlog

- Cada historia es un **slice vertical**: atraviesa base de datos, acceso a datos y pantalla, y al terminarla se puede mostrar funcionando.
- **Estimación** en días ideales (una jornada de una persona sin interrupciones).
- **Prioridad**: número (mayor = más importante) y MoSCoW.
- **Pantalla**: número del boceto en `docs/wireframes/`.
- **TDD**: reglas de negocio que se escriben primero como test.
- **Fuera de esta historia**: lo que esa historia no incluye, aunque esté relacionado.
- **Plan**: las historias complejas (HU04) publican su plan de implementación en el issue antes de programar.

---

## Resumen

| ID | Historia | Est. | Prioridad | Depende de |
|---|---|---|---|---|
| HT01 | Repositorio, tablero y CLAUDE.md | 0,5 | 1000 Must | — |
| HT02 | Esqueleto desplegado con Supabase | 1 | 990 Must | HT01 |
| HU01 | Ver el catálogo de artículos | 1 | 950 Must | HT02 |
| HU02 | Consultar un artículo por WhatsApp | 1 | 930 Must | HU01 |
| HU03 | Iniciar sesión como dueño | 1 | 900 Must | HT02 |
| HU04 | Cargar un artículo con nombre e imagen | 2 | 880 Must | HU03 |
| HU05 | Marcar sin stock, editar y dar de baja | 1,5 | 850 Must | HU04 |
| HU06 | Buscar artículos por nombre | 0,5 | 400 Could | HU01 |
| — | Carrito y pagos online | — | Won't | la venta es por WhatsApp |
| — | Precios, talles y categorías | — | ⚠️ | pendiente con el cliente |

**Totales**: Must 8 días · Could 0,5 · **Total 8,5 días**.

---

## Historias técnicas

### HT01 · Repositorio, tablero y CLAUDE.md
**Como** desarrollador **quiero** el repositorio con `main` y `dev`, el tablero y las instrucciones **para** trabajar con la metodología desde el primer día.
**Estimación**: 0,5 · **Prioridad**: 1000 Must · **Depende de**: —

**Pruebas de aceptación**
- El repositorio existe en GitHub, es público y tiene las ramas `main` y `dev`, ambas protegidas contra push directo (los cambios entran solo por pull request).
- El tablero tiene una tarjeta (issue) por historia de este backlog.
- `CLAUDE.md`, `docs/modelo-de-dominio.md`, `docs/historias-de-usuario.md`, `.gitignore` y `.env.example` están en `dev`.

**TDD**: no aplica.

**Fuera de esta historia**: código de la aplicación (HT02).

### HT02 · Esqueleto desplegado con Supabase
**Como** desarrollador **quiero** una app React + Vite conectada a Supabase y desplegada **para** que cada historia se pueda mostrar funcionando en staging.
**Estimación**: 1 · **Prioridad**: 990 Must · **Depende de**: HT01

**Slice**: proyecto Supabase · `src/lib/supabase.js` · página de inicio con el logo.

**Pruebas de aceptación**
- `npm run dev` muestra una página con el logo de Noventa Camisetas.
- `npm test` corre Vitest con un test de ejemplo en verde.
- Render publica staging desde `dev` y producción desde `main`.
- `.env.example` lista `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_WHATSAPP_NUMERO` sin valores.
- Una tarea de cron-job.org hace una consulta mínima a Supabase una vez por día y responde 200, para que el plan gratuito no pause el proyecto por inactividad (7 días). No se usa GitHub Actions porque el repositorio es público y GitHub desactiva los workflows programados de repos públicos sin actividad en 60 días.
- Todo funciona con los planes gratuitos de Supabase, Render y GitHub: costo $0.

**TDD**: no aplica.

**Fuera de esta historia**: tabla `articulos` (HU01), login (HU03), dominio propio (lo decide el cliente).

---

## Historias de usuario

### HU01 · Ver el catálogo de artículos
**Como** visitante **quiero** ver los artículos con su foto, su nombre y si hay stock **para** elegir qué consultar.
**Estimación**: 1 · **Prioridad**: 950 Must · **Depende de**: HT02 · **Pantalla**: 01, 02, 03

**Slice**: tabla `articulos` + política RLS de lectura · `articulos.api.js` (`listarCatalogo`) · página Catálogo (`/`).

**Pruebas de aceptación**
- Hay artículos: se ven en una grilla con foto y nombre; primero los disponibles y después los sin stock, cada grupo del más nuevo al más viejo.
- Un artículo con `disponible = false`: aparece con la foto atenuada y la etiqueta "Sin stock".
- Un artículo con `baja_en`: no aparece.
- No hay artículos: se ve el mensaje "Por ahora no hay artículos cargados. Escribinos por WhatsApp."
- En el celular la grilla se ve en dos columnas y sin scroll horizontal.

**TDD**: R1, qué artículos se muestran y en qué orden (`ordenarCatalogo`).

**Fuera de esta historia**: botón de WhatsApp (HU02), carga de artículos (HU04). Para probar se cargan artículos a mano en Supabase.

### HU02 · Consultar un artículo por WhatsApp
**Como** visitante **quiero** presionar **Consultar** en un artículo **para** abrir WhatsApp con el dueño y un mensaje ya escrito.
**Estimación**: 1 · **Prioridad**: 930 Must · **Depende de**: HU01 · **Pantalla**: 01, 03, 04

**Slice**: `whatsapp.rules.js` · botón **Consultar** en cada tarjeta del catálogo.

**Pruebas de aceptación**
- Presionar **Consultar** en "Camiseta Argentina 1986": se abre `https://wa.me/<numero>?text=Hola!%20Quiero%20consultar%20por%3A%20Camiseta%20Argentina%201986` en una pestaña nueva (o la app en el celular).
- Un nombre con tildes, `&` o `#`: el mensaje llega completo y bien escrito.
- Presionar **Consultar** en un artículo sin stock "Camiseta Boca 2000": el mensaje es "Hola! ¿Te vuelve a entrar Camiseta Boca 2000?".
- Hay un botón flotante de WhatsApp sin artículo: abre el chat con "Hola! Quiero hacer una consulta."

**TDD**: R4, normalizar el número; R5, armar el enlace con el mensaje según haya o no stock, codificado (`armarEnlaceConsulta`).

**Fuera de esta historia**: guardar o contar las consultas.

### HU03 · Iniciar sesión como dueño
**Como** dueño **quiero** entrar a un panel con mi email y contraseña **para** administrar mis artículos sin que otro pueda hacerlo.
**Estimación**: 1 · **Prioridad**: 900 Must · **Depende de**: HT02 · **Pantalla**: 05

**Slice**: Supabase Auth · `auth.api.js` · páginas Login (`/admin/login`) y Panel (`/admin`) protegida.

**Pruebas de aceptación**
- Email y contraseña correctos: entra al panel.
- Datos incorrectos: se ve "Email o contraseña incorrectos." y sigue en el login.
- Entrar a `/admin` sin sesión: redirige a `/admin/login`.
- **Cerrar sesión**: vuelve al login y `/admin` deja de estar accesible.
- El registro de usuarios está desactivado en Supabase: intentar crear una cuenta desde la API con la clave pública devuelve error. El único usuario es el dueño, creado a mano.

**TDD**: no aplica (lo resuelve Supabase Auth).

**Fuera de esta historia**: registro desde la web y recuperación de contraseña (el usuario se crea en el panel de Supabase).

### HU04 · Cargar un artículo con nombre e imagen
**Como** dueño **quiero** cargar un artículo con nombre y foto **para** que aparezca en el catálogo.
**Estimación**: 2 · **Prioridad**: 880 Must · **Depende de**: HU03 · **Pantalla**: 06, 07

**Slice**: bucket `articulos` + políticas RLS de escritura · `articulos.api.js` (`crearArticulo`) · formulario en el Panel.

**Pruebas de aceptación**
- Nombre válido y foto JPG de 4 MB sacada con el celular: se guarda comprimida (WEBP, lado mayor de 1200 px, menos de 300 KB) y se ve en el panel y en el catálogo público.
- Desde el celular, el campo de foto ofrece sacar una foto con la cámara o elegirla de la galería.
- Nombre vacío o de menos de 3 caracteres: "El nombre debe tener entre 3 y 80 caracteres."
- Archivo PDF o de más de 10 MB: "La imagen debe ser JPG, PNG o WEBP de hasta 10 MB."
- Mientras sube: el botón muestra "Guardando…" y no se puede presionar dos veces.
- Un visitante sin sesión que intenta insertar en la tabla o subir al bucket: Supabase lo rechaza.
- Un usuario con sesión cuyo id no es el del dueño: Supabase también lo rechaza (las políticas comparan `auth.uid()` con el id del dueño, no solo "tiene sesión").

**TDD**: R2, validar el nombre (`validarNombre`); R3, validar la imagen (`validarImagen`); R7, calcular las medidas de la foto comprimida (`calcularMedidas`).

**Fuera de esta historia**: editar, marcar sin stock o dar de baja (HU05); recortar la foto a mano.

**Plan**: antes de programar, publicar el plan de implementación en el issue (políticas RLS y Storage).

### HU05 · Marcar sin stock, editar y dar de baja
**Como** dueño **quiero** marcar un artículo sin stock, cambiar su nombre o foto, o darlo de baja **para** que el catálogo muestre solo lo que tengo.
**Estimación**: 1,5 · **Prioridad**: 850 Must · **Depende de**: HU04 · **Pantalla**: 06, 07, 08

**Slice**: `articulos.api.js` (`actualizarArticulo`, `darDeBaja`) · listado del Panel con acciones.

**Pruebas de aceptación**
- **Sin stock**: el artículo pasa al final del catálogo con la etiqueta "Sin stock" y su **Consultar** pregunta si vuelve a entrar; **Volver a stock** lo deja disponible de nuevo.
- Editar nombre o foto: el cambio se ve en el catálogo, con las mismas validaciones de HU04.
- **Dar de baja**: pide confirmación "¿Dar de baja este artículo? No se va a mostrar más."; al confirmar desaparece del panel y del catálogo, pero sigue en la base con `baja_en`.

**TDD**: reutiliza R2 y R3; no hay regla nueva.

**Fuera de esta historia**: recuperar artículos dados de baja; ordenar a mano el catálogo.

### HU06 · Buscar artículos por nombre
**Como** visitante **quiero** buscar por nombre **para** encontrar rápido la camiseta que quiero.
**Estimación**: 0,5 · **Prioridad**: 400 Could · **Depende de**: HU01 · **Pantalla**: 01, 03

**Slice**: campo de búsqueda en el Catálogo.

**Pruebas de aceptación**
- Escribir "boca": se ven solo los artículos cuyo nombre contiene "boca", sin importar mayúsculas ni tildes.
- Sin resultados: "No encontramos artículos con ese nombre."

**TDD**: buscar por nombre ignorando mayúsculas y tildes (`buscarPorNombre`).

**Fuera de esta historia**: filtros por categoría o talle.
