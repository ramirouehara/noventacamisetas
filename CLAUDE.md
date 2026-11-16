# CLAUDE.md

Instrucciones para los agentes de IA que trabajan en este repositorio, así el código queda con el mismo
estilo aunque lo escriban personas distintas.

## El proyecto

Catálogo web de **Noventa Camisetas** (artículos de fútbol, sobre todo camisetas). El dueño carga los
artículos que tiene en stock con nombre e imagen; los visitantes ven los disponibles y, con el botón
**Consultar**, abren WhatsApp con un mensaje armado. La venta se cierra siempre por WhatsApp: no hay
carrito ni pagos en la web.

## Metodología

Trabajamos con **Scrum** para organizarnos y **TDD** para las reglas de negocio.

- El Product Backlog está en `docs/historias-de-usuario.md` y cada historia es un issue del tablero.
- Cada historia es un **corte vertical**: atraviesa base de datos, acceso a datos y pantalla, y al
  terminarla se puede mostrar funcionando. La hace una sola persona de punta a punta.
- Cada historia tiene: descripción ("Como… quiero… para…"), estimación en días ideales, prioridad
  (número y MoSCoW), dependencias, pruebas de aceptación, reglas marcadas con **TDD** y una sección
  **"Fuera de esta historia"**.

## Antes de empezar

- Leer `docs/modelo-de-dominio.md` (entidades y reglas).
- Trabajar sobre **una sola historia** por vez. Lo que dice "Fuera de esta historia" no se programa,
  aunque parezca fácil.
- Si se detecta una mejora, un error en otra parte o algo que falta, no se hace de paso: se propone
  crear un issue con la etiqueta `sugerencia`.
- En las historias complejas (HU04), primero se escribe un plan de implementación para que el usuario
  lo revise y lo publique en el issue. Recién después se programa.
- El usuario es el navigator: pasos chicos y explicar lo que se escribe. Si no lo entiende, no entra.

## Empezar o retomar una historia

Cuando el usuario diga **"voy a hacer la HU02"**:

1. Traer lo último de `dev`: `git switch dev` y `git pull`.
2. Buscar el issue con `gh issue list --search "HU02"` y leerlo con `gh issue view <N>`.
3. Crear la rama desde `dev`: `feat/hu02-descripcion-corta` (`chore/` para historias técnicas).
4. Antes de escribir código, explicar qué pide la historia, sus pruebas de aceptación, qué reglas van
   con TDD y qué queda fuera. Después proponer un plan de pasos chicos y esperar el OK.
5. Recordarle que se asigne la historia en el tablero y la mueva a **In Progress**.

Cuando diga **"seguimos con la HU02"**:

1. Verificar con `git status` que está en la rama de la historia y sin cambios sueltos.
2. Traer lo nuevo de `dev`: `git pull origin dev`.
3. Resumir qué está hecho (`git log dev..HEAD`) y qué falta según el plan, y proponer el próximo paso.

## Tests (TDD)

- **TDD solo en las reglas de negocio** que la historia marca con TDD: primero el test que falla,
  después el código mínimo que lo hace pasar y al final se refactoriza con los tests en verde.
- Esas reglas van como **funciones puras** en `<modulo>.rules.js` (sin Supabase ni React).
- No hay API propia: el acceso a datos (`<modulo>.api.js`) se prueba con un test que usa un cliente de
  Supabase simulado y verifica la consulta que se arma y el manejo de errores.
- Los tests van junto al código: `<modulo>.rules.test.js`, `<modulo>.api.test.js`.

## Stack

| Pieza | Tecnología |
|---|---|
| Interfaz | React + Vite, JavaScript (sin TypeScript) |
| Datos | Supabase: Postgres (tabla `articulos`), Storage (bucket `articulos` para las fotos) y Auth (login del dueño) |
| Seguridad | Row Level Security: cualquiera lee los artículos no dados de baja (con y sin stock); solo el dueño (`auth.uid()` igual a su id) crea, edita o da de baja. Registro de usuarios desactivado en Supabase |
| Tests | Vitest |
| Despliegue | Render, sitio estático (`dist/`). Dos servicios: staging despliega `dev` y producción despliega `main` |

## Estructura

```
noventacamisetas/
├── assets/                 logo original del cliente
├── public/                 archivos estáticos servidos tal cual (logo optimizado, favicon)
├── src/
│   ├── main.jsx            punto de entrada
│   ├── App.jsx             rutas: catálogo público (/) y panel del dueño (/admin)
│   ├── lib/supabase.js     cliente de Supabase compartido
│   ├── pages/              una página por pantalla
│   ├── components/         componentes reutilizables
│   └── modules/<modulo>/
│       ├── <modulo>.api.js      acceso a datos con Supabase
│       ├── <modulo>.rules.js    reglas de negocio puras
│       └── *.test.js            tests junto al código
├── supabase/migrations/    SQL de tablas, políticas RLS y bucket
└── docs/                   modelo de dominio e historias
```

Módulos: `articulos`, `whatsapp`, `auth`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run dev` | Levanta Vite en modo desarrollo |
| `npm test` | Corre todos los tests |
| `npm run build` | Compila el sitio en `dist/` |
| `npm run preview` | Sirve el build localmente (como en Render) |

## Convenciones

- Dominio en español, igual que en el modelo (`articulo`, `disponible`); términos técnicos en inglés
  (`api`, `rules`, `handler`).
- Datos calculados se calculan, nunca se guardan.
- Nada se borra: baja lógica con fecha (`baja_en`). Las fotos de un artículo dado de baja se conservan.
- Si en el futuro se agregan precios: dinero siempre en decimal fijo (`numeric`), nunca en punto flotante.
- Secretos solo en `.env`, que nunca se sube. Toda variable nueva se agrega sin valor a `.env.example`.
  No leer ni editar el `.env`: si hace falta cambiarlo, pedírselo al usuario.
- La clave `anon` de Supabase es pública por diseño; la seguridad la dan las políticas RLS. La clave
  `service_role` nunca va en el código del cliente.

## Definición de Terminado

Una historia está terminada cuando:
- El código está en `dev` por pull request, revisado y aprobado.
- Pasan todos los tests, incluidos los de las reglas con TDD.
- Se cumplen todas sus pruebas de aceptación.
- Funciona en staging.
- El cliente (Product Owner) la aceptó.

## Git y pull requests

- Nunca push a `dev` ni a `main`. Las historias entran a `dev` por pull request con **Squash and merge**.
- `dev` pasa a `main` solo en un PR de release, con **Create a merge commit**.
- Una historia = una rama = un PR. Rama: `tipo/hu02-descripcion-corta` (`feat/`, `fix/`, `docs/`, `chore/`).
- Commits con Conventional Commits, en presente y minúsculas: `feat(articulos): agregar alta de artículo`.
- Título del PR en formato de commit con el ID de la historia; descripción con la línea `Closes #N`.
- PRs de menos de unas 400 líneas cambiadas.
- Antes del PR: traer `dev` y correr los tests.
