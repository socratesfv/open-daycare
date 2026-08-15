# SPEC 07 — Mantenimiento de niños y salas

> **Status:** Implementado
> **Depends on:** SPEC 06
> **Date:** 2026-08-14
> **Objective:** Implementar pantalla /ninos con lista de niños, búsqueda por nombre, modales de crear y editar niño, y seed de 3 salas por defecto (Soles, Estrellas, Lunas) en Supabase.

---

## Scope

**In:**

- Seed de 3 salas por defecto (Soles, Estrellas, Lunas) asociadas al daycare
- Pantalla `/ninos` con lista de niños en formato grid (2 columnas en desktop, 1 en móvil)
- Barra de búsqueda por nombre de niño
- Modal "Agregar niño" con formulario: nombre completo, fecha de nacimiento, fecha de ingreso, sala (dropdown), alergias (tags), notas médicas, consentimiento de fotos
- Modal "Editar niño" con mismo formulario precargado
- Conexión a Supabase: lectura de children y rooms, inserción de children
- Diseño fiel al mockup `ninos.dc.html` y `agregar-nino.dc.html`

**Fuera de alcance (specs futuros):**

- Eliminar o archivar niños
- CRUD de salas (crear, editar, eliminar)
- Perfil detallado de niño (`perfil-nino.dc.html`)
- Vinculación de padres a niños
- Asignación de fotos a niños
- Filtros por sala (se muestra una sala a la vez, por defecto Soles)
- Paginación de la lista

---

## Data model

Estructuras de Supabase (ya definidas en el esquema de BD):

```typescript
// Tabla rooms (ya existe en Supabase)
interface Room {
  id: string;          // uuid PK
  daycare_id: string;  // uuid FK → daycares
  name: string;        // text
  created_at: string;  // timestamptz
}

// Tabla children (ya existe en Supabase)
interface Child {
  id: string;            // uuid PK
  room_id: string | null;// uuid FK → rooms (nullable)
  full_name: string;     // text
  birth_date: string;    // date
  enrolled_at: string;   // date
  medical_notes: string; // text
  allergy_tags: string[];// text[] - valores en inglés
  photo_consent: boolean;// default true
  status: 'active' | 'archived'; // child_status enum
  created_at: string;    // timestamptz
  updated_at: string;    // timestamptz
}

// Tipo para el formulario de crear/editar niño
interface ChildFormData {
  full_name: string;
  birth_date: string;
  enrolled_at: string;
  room_id: string;
  allergy_tags: string[];
  medical_notes: string;
  photo_consent: boolean;
}
```

Convenciones:

- `allergy_tags` se guardan en inglés (`peanut`, `lactose`, `gluten`); la UI traduce a español
- `status` default es `active`
- Las 3 salas por defecto se crean con un seed en la migración
- El dropdown de sala muestra los nombres en español pero guarda el `id` de la sala

---

## Implementation plan

1. **Crear migración de seed para salas por defecto**:
   - Usar `apply_migration` para insertar 3 salas (Soles, Estrellas, Lunas) en la tabla `rooms`
   - Cada sala asociada al daycare existente (obtener `daycare_id` del registro actual)
   - Verificar que las salas se crearon correctamente con `execute_sql`

2. **Crear migración de tablas `children` y `rooms`**:
   - Usar `apply_migration` para crear la tabla `rooms` si no existe (campos: id, daycare_id, name, created_at)
   - Usar `apply_migration` para crear la tabla `children` si no existe (campos según esquema)
   - Activar RLS en ambas tablas
   - Crear políticas RLS para `authenticated` con patrón `USING (owner)`

3. **Crear helper de Supabase para niños**:
   - Archivo: `utils/supabase/children.ts`
   - Función `getChildren(daycareId)` → retorna lista de niños de un daycare
   - Función `getChild(childId)` → retorna un niño por ID
   - Función `createChild(data)` → inserta un niño nuevo
   - Función `updateChild(childId, data)` → actualiza un niño existente
   - Función `getRooms(daycareId)` → retorna las salas de un daycare

4. **Crear componente `ChildrenList.tsx`**:
   - Server Component que carga los niños desde Supabase
   - Grid de cards (2 columnas desktop, 1 móvil)
   - Cada card muestra: avatar con inicial, nombre, edad calculada, tags de alergias
   - Header con título "Niños" y botón "Agregar niño"
   - Barra de búsqueda por nombre (filtro client-side)
   - Diseño fiel al mockup `ninos.dc.html`

5. **Crear componente `ChildFormModal.tsx`**:
   - Modal reutilizable para crear y editar
   - Props: `isOpen`, `onClose`, `child?` (si es edición)
   - Formulario con campos: nombre, fecha nacimiento, fecha ingreso, sala (dropdown), alergias (input de tags), notas médicas (textarea), consentimiento fotos (checkbox)
   - Validación: todos los campos obligatorios excepto notas médicas
   - Botón "Guardar" que llama a `createChild` o `updateChild`
   - Diseño fiel al mockup `agregar-nino.dc.html`

6. **Crear ruta `/ninos`**:
   - Archivo: `app/ninos/page.tsx`
   - Server Component que renderiza `ChildrenList`
   - Obtener `daycare_id` del usuario autenticado

7. **Actualizar sidebar para incluir link a /ninos**:
   - Verificar que el link "Niños" en el sidebar apunta a `/ninos`
   - El link debe estar activo cuando el usuario está en `/ninos`

8. **Probar flujo completo**:
   - Navegar a `/ninos` → se muestra la lista de niños
   - Buscar por nombre → filtra la lista
   - Click en "Agregar niño" → se abre el modal
   - Llenar formulario y guardar → niño aparece en la lista
   - Click en un niño → se abre modal de edición con datos precargados
   - Editar y guardar → cambios se reflejan en la lista

---

## Acceptance criteria

- [ ] Las 3 salas (Soles, Estrellas, Lunas) existen en la tabla `rooms`
- [ ] Las tablas `children` y `rooms` están creadas en Supabase con RLS activo
- [ ] La pantalla `/ninos` muestra una lista de niños en formato grid
- [ ] El grid muestra 2 columnas en desktop y 1 en móvil
- [ ] Cada card de niño muestra: avatar con inicial, nombre, edad y tags de alergias
- [ ] La barra de búsqueda filtra niños por nombre en tiempo real
- [ ] El botón "Agregar niño" abre un modal con formulario
- [ ] El formulario tiene: nombre, fecha nacimiento, fecha ingreso, sala, alergias, notas médicas, consentimiento fotos
- [ ] El dropdown de sala muestra las 3 salas por defecto
- [ ] El campo de alergias permite agregar múltiples tags
- [ ] El checkbox de consentimiento de fotos está marcado por defecto
- [ ] Al guardar un niño nuevo, se inserta en Supabase y aparece en la lista
- [ ] Al hacer click en un niño, se abre modal de edición precargado
- [ ] Al editar y guardar, los cambios se reflejan en la lista
- [ ] El diseño es fiel a los mockups `ninos.dc.html` y `agregar-nino.dc.html`
- [ ] Los colores coinciden: fondo #F6ECDF, cards #FFFDF9, bordes #ECE0D0, botón naranja #EE8164
- [ ] El sidebar muestra el link "Niños" activo cuando se está en `/ninos`

---

## Decisions

- **Sí:** Seed de 3 salas por defecto (Soles, Estrellas, Lunas) en la migración. El usuario las especificó.
- **Sí:** Helper de Supabase en `utils/supabase/children.ts`. Separa la lógica de acceso a datos del componente.
- **Sí:** Búsqueda por nombre en tiempo real (client-side). Para pocos niños no se necesita paginación.
- **Sí:** Modal reutilizable para crear y editar. Mantiene consistencia con SPEC 04 y 05.
- **Sí:** Campo de alergias como input de tags (separados por coma). El esquema usa `text[]`.
- **Sí:** Consentimiento de fotos marcado por defecto. El esquema lo define así.
- **Sí:** Todos los campos obligatorios excepto notas médicas. Consistente con el mockup.
- **Sí:** Diseño fiel a los mockups existentes. No se inventa UI nueva.
- **Sí:** Conexión a Supabase con tools MCP. Lo especificó el usuario.
- **No:** Eliminar o archivar niños. Fuera de alcance según el usuario.
- **No:** CRUD de salas. Solo se necesita que existan, no gestionarlas.
- **No:** Paginación. Para el volumen esperado de una guardería no es necesaria.
- **No:** Filtros por sala. Se muestra una sala a la vez por defecto.
- **No:** Perfil detallado de niño. Es otro spec (`perfil-nino.dc.html`).

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Las tablas `children` o `rooms` no existen en Supabase | Verificar con `list_tables` antes de crear helpers; crear migración si no existen |
| El `daycare_id` del usuario no se obtiene correctamente | Usar la tabla `users` para obtener el `daycare_id` del usuario autenticado |
| Las alergias como tags pueden causar problemas de UX | Input separado por coma con preview de tags; validar en el formulario |
| El dropdown de salas no carga datos | Crear función `getRooms` que consulte Supabase; mostrar "Cargando..." mientras |
| El modal de edición no precarga los datos correctamente | Pasar el objeto `child` completo al modal; usar `useEffect` para setear el formulario |
| RLS bloquea las consultas | Crear políticas `SELECT`, `INSERT`, `UPDATE` para `authenticated` con patrón `USING (owner)` |

---

## What is **not** in this spec

- Eliminar o archivar niños
- CRUD de salas (crear, editar, eliminar)
- Perfil detallado de niño (`perfil-nino.dc.html`)
- Vinculación de padres a niños
- Asignación de fotos a niños
- Filtros por sala
- Paginación de la lista
- Búsqueda avanzada (por alergia, por fecha, etc.)
- Exportar lista de niños
- Estadísticas de niños por sala
