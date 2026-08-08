# SPEC 01 — Implementar página Home con feed de publicaciones

> **Status:** Borrador
> **Depends on:** —
> **Date:** 2026-08-08
> **Objective:** Implementar la página Home del sistema daycare replicando fielmente el diseño del mockup `feed.dc.html` con sidebar, feed de publicaciones y responsive layout.

---

## Scope

**In:**

- Sidebar con logo, navegación (Feed, Niños, Avisos, Mi cuenta), perfil de usuario y botón de cerrar sesión
- Área principal del feed con:
  - Header de bienvenida ("Buenas, Caro")
  - Tarjeta para crear nueva publicación
  - Sección "PUBLICADO HOY"
  - 3 tipos de publicaciones de ejemplo: Logro, Actividad (con foto), Anuncio
  - Acciones de cada post: Me gusta, Comentarios, Editar
- Layout responsive (sidebar colapsable en móvil)
- Datos ficticios hardcodeados en `data/mock/`

**Fuera de alcance (specs futuros):**

- Funcionalidad de crear/editar publicaciones
- Sistema de autenticación
- Conexión a base de datos
- Otras páginas (Niños, Avisos, Mi cuenta)
- Funcionalidad real de likes/comentarios

---

## Data model

Estructuras de datos ficticias para el feed:

```typescript
// data/mock/posts.ts
export interface Author {
  id: string;
  name: string;
  initials: string;
  color: string; // color del avatar
}

export interface Post {
  id: string;
  type: 'logro' | 'actividad' | 'anuncio';
  author: Author;
  timestamp: string;
  publishedBy: string;
  target: string; // "familia de Mateo" o "toda la sala"
  content: string;
  imageUrl?: string; // solo para tipo actividad
  imageCaption?: string;
  likes: number;
  comments: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  room: string;
  initials: string;
}
```

Datos de ejemplo:
- 3 publicaciones (1 logro, 1 actividad con foto, 1 anuncio)
- 1 usuario actual (Caro Giménez, Maestra, Sala Soles)
- 1 niño mencionado (Mateo)

---

## Implementation plan

1. Crear estructura de carpetas: `app/components/`, `data/mock/`
2. Crear archivo `data/mock/posts.ts` con tipos e interfaces + datos de ejemplo
3. Crear componente `Sidebar.tsx` con layout vertical: logo, navegación, perfil de usuario
4. Crear componente `FeedPost.tsx` que renderice los 3 tipos de publicación (logro, actividad, anuncio) con sus estilos y acciones
5. Crear componente `CreatePostCard.tsx` para la tarjeta de "Compartí un momento..."
6. Crear componente `FeedHeader.tsx` con bienvenida y contador de niños
7. Actualizar `app/globals.css` con colores y tipografía del mockup (Fredoka, Nunito, colores personalizados)
8. Actualizar `app/layout.tsx` con fuentes Google (Fredoka, Nunito) y configuración de metadata
9. Actualizar `app/page.tsx` para componer Sidebar + Feed completo con datos mock
10. Verificar responsive: en pantallas <768px el sidebar se oculta, se muestra menú hamburguesa

---

## Acceptance criteria

- [ ] El layout tiene sidebar fijo a la izquierda (248px) + área principal scrollable
- [ ] El sidebar muestra logo "OpenDayCare", sala "Soles", navegación con 4 ítems, perfil de usuario
- [ ] La sección Feed está activa (resaltada en naranja) en la navegación
- [ ] El feed muestra 3 publicaciones: logro (Mateo, orinal), actividad (Mateo, pintura), anuncio (parque)
- [ ] Cada publicación tiene avatar, nombre, timestamp, tipo con badge de color, contenido, likes y comentarios
- [ ] La tarjeta "Compartí un momento..." tiene avatar del usuario y botón de cámara
- [ ] Los colores del mockup están replicados: fondo #F6ECDF, cards #FFFDF9, acentos naranja #E0654A
- [ ] Las fuentes Fredoka (títulos) y Nunito (cuerpo) están cargadas
- [ ] En móvil (<768px) el sidebar se oculta y aparece botón hamburguesa para abrirlo
- [ ] El diseño es idéntico al mockup `feed.dc.html` en desktop y móvil

---

## Decisions

- **Sí:** Datos ficticios en `data/mock/` separados de los componentes. Fácil de reemplazar cuando haya base de datos.
- **Sí:** Componentes en `app/components/` siguiendo la convención de Next.js App Router.
- **Sí:** Fuentes Google (Fredoka, Nunito) importadas en `layout.tsx` para mantener fidelidad con el mockup.
- **Sí:** Colores hardcodeados en CSS del mockup, no en Tailwind config (Next.js 16 con Tailwind v4 no usa `tailwind.config`).
- **No:** Componentes de UI genéricos (Button, Card). El mockup es muy específico, mejor estilos directos.
- **No:** Lazy loading o optimización de imágenes. Solo es UI estática por ahora.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Fuentes Google no cargan | Usar fallback `system-ui, sans-serif` en CSS |
| Tailwind v4 tiene cambios | Seguir documentación de `@tailwindcss/postcss` en `node_modules/next/dist/docs/` |
| Responsive rompe diseño desktop | Testear en ambos breakpoints antes de marcar completo |

---

## What is NOT in this spec

- Funcionalidad de crear publicaciones (solo el botón visual)
- Likes reales o sistema de comentarios
- Autenticación de usuarios
- Base de datos o persistencia
- Otras páginas del sistema (Niños, Avisos, Mi cuenta)
- Sidebar colapsable con estado persistido
