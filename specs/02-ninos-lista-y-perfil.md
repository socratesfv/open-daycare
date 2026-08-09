# SPEC 02 — Implementar páginas de lista de niños y perfil individual

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-08-09
> **Objective:** Implementar las páginas de lista de niños y perfil individual replicando el diseño de los mockups ninos.dc.html y perfil-nino.dc.html con componentes reutilizables, datos mock y responsive completo.

---

## Scope

**In:**

- Página `/ninos` con grid de tarjetas de niños (2 columnas en desktop, 1 en móvil)
- Barra de búsqueda funcional con filtro local por nombre
- Tarjetas de niño con: avatar, nombre, edad, cantidad de padres vinculados, badge de alergia o badge VINCULAR
- Página `/ninos/[id]` con perfil completo del niño:
  - Avatar grande, nombre, edad, sala
  - Botón "Editar" (visual)
  - Tarjeta de alergias y notas
  - Información: fecha de nacimiento, sala, fecha de ingreso
  - Sección de padres vinculados (activos y pendientes)
  - Botón "Vincular otro padre" (visual)
  - Botón "Resumen del día" (visual)
- Datos mock en `data/mock/children.ts` con 8 niños y sus padres
- Reutilización del componente `Sidebar.tsx` existente
- Responsive completo (mobile menu, grid adaptable)

**Fuera de alcance (specs futuros):**

- Funcionalidad de crear/editar niños
- Funcionalidad de vincular padres reales
- Página de resumen del día
- Conexión a base de datos
- Sistema de autenticación
- Búsqueda con debounce o server-side
- Paginación del grid

---

## Data model

Estructuras de datos ficticias para niños y padres:

```typescript
// data/mock/children.ts
export interface Parent {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string; // "Mamá" | "Papá"
  status: 'active' | 'pending';
}

export interface Child {
  id: string;
  name: string;
  initials: string;
  color: string;
  age: number;
  room: string;
  admissionDate: string;
  birthDate: string;
  allergies?: string; // "Alergia al maní. Evitar frutos secos."
  parents: Parent[];
}
```

Convenciones:

- `color` es el color de fondo del avatar (hex sin #)
- `status` en parents: `'active'` = badge verde ACTIVA, `'pending'` = badge amarillo PENDIENTE
- `allergies` es undefined si no tiene alergias
- El badge de alergia muestra la primera palabra de `allergies` en mayúsculas (ej: "MANÍ", "LACTOSA")
- Si el niño no tiene padres activos, se muestra badge "VINCULAR"

---

## Implementation plan

1. Crear `data/mock/children.ts` con interfaces `Child` y `Parent` + 8 niños de ejemplo con sus padres
2. Crear componente `app/components/SearchBar.tsx` con input de búsqueda estilizado
3. Crear componente `app/components/ChildCard.tsx` para las tarjetas del grid (avatar, nombre, info, badge)
4. Crear componente `app/components/ParentList.tsx` para la sección de padres vinculados en el perfil
5. Crear componente `app/components/ChildProfile.tsx` con el layout completo del perfil (info, alergias, padres)
6. Crear página `app/ninos/page.tsx` con grid de ChildrenCards, SearchBar y filtro local
7. Crear página `app/ninos/[id]/page.tsx` con ChildProfile y botón de retorno
8. Actualizar `app/globals.css` con estilos adicionales si es necesario (clases kid hover)
9. Verificar responsive: en pantallas <768px grid de 1 columna, sidebar colapsable
10. Verificar que la búsqueda filtra niños en tiempo real por nombre

---

## Acceptance criteria

- [ ] La página /ninos muestra un grid de 8 tarjetas de niños en 2 columnas (desktop)
- [ ] Cada tarjeta tiene avatar con inicial, nombre, edad, info de padres, y badge (alergia o VINCULAR)
- [ ] La barra de búsqueda filtra los niños por nombre en tiempo al escribir
- [ ] El sidebar muestra "Niños" como item activo (resaltado en naranja)
- [ ] El botón "Agregar niño" es visual (no hace nada al hacer click)
- [ ] La página /ninos/[id] muestra el perfil completo del niño seleccionado
- [ ] El perfil muestra avatar grande (84px), nombre, edad y sala
- [ ] El perfil tiene tarjeta de alergias con fondo rosa claro y icono de advertencia
- [ ] El perfil muestra fecha de nacimiento, sala y fecha de ingreso en filas separadas
- [ ] La sección de padres muestra padres activos con badge verde "ACTIVA"
- [ ] La sección de padres muestra padres pendientes con badge amarillo "PENDIENTE"
- [ ] El botón "Vincular otro padre" es visual
- [ ] El botón "Resumen del día" es visual
- [ ] El enlace "Volver a Niños" en el perfil navega a /ninos
- [ ] En móvil (<768px) el grid cambia a 1 columna
- [ ] En móvil el sidebar se oculta y aparece menú hamburguesa
- [ ] Los colores del mockup están replicados: fondo #F6ECDF, cards #FFFDF9, badges de color
- [ ] Las fuentes Fredoka (títulos) y Nunito (cuerpo) se mantienen

---

## Decisions

- **Sí:** Datos mock en `data/mock/children.ts` separados de los componentes. Misma convención que SPEC 01.
- **Sí:** Reusar componente `Sidebar.tsx` existente. Solo cambia el `activeItem` a "Niños".
- **Sí:** Búsqueda funcional con filtro local (`useState`). Sin debounce por ser solo 8 elementos.
- **Sí:** Badges de alergia muestran la primera palabra del campo `allergies` en mayúsculas.
- **Sí:** Badge "VINCULAR" se muestra cuando el niño no tiene padres con status 'active'.
- **Sí:** Páginas en App Router (`app/ninos/page.tsx` y `app/ninos/[id]/page.tsx`).
- **Sí:** Responsive completo reutilizando la lógica del Sidebar existente.
- **No:** Componentes de UI genéricos (Button, Card). El mockup es muy específico, mejor estilos directos.
- **No:** Funcionalidad real de búsqueda con debounce o server-side. Solo filtro local.
- **No:** Paginación. El mockup muestra todos los niños sin paginación.
- **No:** Lazy loading o optimización de imágenes. Solo es UI estática por ahora.
- **No:** Integración con router para botones "Editar", "Vincular otro padre" o "Resumen del día".

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Fuentes Google no cargan | Usar fallback `system-ui, sans-serif` en CSS (ya configurado en globals.css) |
| Tailwind v4 tiene cambios | Seguir documentación existente, los estilos del SPEC 01 ya funcionan |
| Responsive rompe diseño desktop | Testear en ambos breakpoints antes de marcar completo |
| Sidebar colapsable no funciona | Reusar la lógica existente de Sidebar.tsx que ya lo implementa |
| Búsqueda filtra demasiado rápido | Para 8 elementos no es problema, sin debounce necesario |

---

## What is NOT in this spec

- Funcionalidad de crear/editar niños (solo el botón visual)
- Funcionalidad de vincular padres reales
- Página de resumen del día
- Conexión a base de datos o persistencia
- Autenticación de usuarios
- Sistema de notificaciones
- Búsqueda con debounce o server-side
- Paginación del grid de niños
- Integración con API externa
