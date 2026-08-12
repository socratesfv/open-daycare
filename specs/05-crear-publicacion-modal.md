# SPEC 05 — Modal de crear publicación con formulario validado

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-08-11
> **Objective:** Implementar modal con formulario validado para crear publicaciones, accesible desde el feed principal, con selección de niño, tipo, descripción y adjunto de fotos.

---

## Scope

**In:**

- Modal con formulario de crear publicación que replica el diseño de `crear-publicacion.dc.html`
- Campo "Para": selección de un niño (radio buttons) usando datos mock de `children.ts`, más opción "Toda la sala"
- Campo "Tipo": selección de un tipo de publicación (radio buttons) con 7 opciones: Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio
- Campo "Descripción": textarea obligatorio
- Campo "Fotos": input file real para subir imágenes (jpg, png, webp), máximo 4 fotos, máximo 4MB por foto
- Todos los campos son obligatorios
- Validación al presionar "Publicar": muestra errores si hay campos vacíos
- Botón "Publicar" siempre habilitado; valida al presionar y muestra errores
- Botón "Cancelar" superior cierra el modal
- Click fuera del modal NO cierra el modal
- Fondo overlay con opacidad 0.8
- Preview de fotos seleccionadas con opción de eliminar cada una
- Al presionar "Publicar" con datos válidos: console.log con los datos y cierre del modal (sin persistencia)
- Diseño responsive: fullscreen en móvil, modal centrado en desktop

**Fuera de alcance (specs futuros):**

- Persistencia de publicaciones (el botón "Publicar" no guarda nada por ahora)
- Edición de publicaciones existentes
- Eliminación de publicaciones
- Sistema de likes y comentarios
- Notificaciones a padres
- Feed infinito o paginación
- Filtros de publicaciones por tipo o niño
- Compartir publicaciones externamente

---

## Data model

Actualización del tipo `PostType` existente en `data/mock/posts.ts`:

```typescript
// data/mock/posts.ts (actualización)

export type PostType = "comida" | "siesta" | "actividad" | "logro" | "animo" | "foto" | "anuncio";

// Nueva interfaz para el formulario de publicación
export interface PostFormData {
  childId: string; // "all" para "Toda la sala", o ID del niño
  type: PostType;
  description: string;
  photos: File[]; // máximo 4 archivos
}
```

Convenciones:

- `childId` usa `"all"` como valor especial para "Toda la sala"
- `photos` es un array de objetos `File` del navegador
- Cada foto no debe exceder 4MB
- Tipos de archivo permitidos: `image/jpeg`, `image/png`, `image/webp`
- `PostType` se expande de 3 a 7 valores

Colores por tipo de publicación (del mockup):

```typescript
export const POST_TYPE_CONFIG: Record<PostType, { label: string; bg: string; text: string }> = {
  comida:    { label: "Comida",    bg: "#9A7B1E", text: "#fff" },
  siesta:    { label: "Siesta",    bg: "#E7DCF6", text: "#7B5FC0" },
  actividad: { label: "Actividad", bg: "#2E89A6", text: "#fff" },
  logro:     { label: "Logro",     bg: "#CFEBD8", text: "#3E9B6C" },
  animo:     { label: "Ánimo",     bg: "#F9D2DE", text: "#C56486" },
  foto:      { label: "Foto",      bg: "#FBD8CC", text: "#D9684A" },
  anuncio:   { label: "Anuncio",   bg: "#CCD8F4", text: "#4E72C8" },
};
```

---

## Implementation plan

1. **Actualizar `data/mock/posts.ts`**:
   - Expandir `PostType` de 3 a 7 valores
   - Agregar interfaz `PostFormData`
   - Agregar constante `POST_TYPE_CONFIG` con colores por tipo
   - Verificar que los tipos existentes no se rompen

2. **Crear componente `app/components/CreatePostModal.tsx`** con:
   - Props: `isOpen`, `onClose`
   - Estado del formulario controlado con `useState`
   - Campo "Para": lista de niños desde `children.ts` + "Toda la sala"
   - Campo "Tipo": 7 botones de tipo con colores del mockup
   - Campo "Descripción": textarea
   - Campo "Fotos": input file con validación de tipo y tamaño
   - Preview de fotos seleccionadas con botón de eliminar
   - Fondo overlay con opacidad 0.8
   - Click en overlay NO cierra el modal (stopPropagation)
   - Botón "Cancelar" que llama `onClose`
   - Botón "Publicar" que valida y muestra errores

3. **Implementar validación del formulario**:
   - Todos los campos son obligatorios
   - Validación al presionar "Publicar" (no en tiempo real)
   - Mensajes de error debajo de cada campo
   - Botón "Publicar" siempre habilitado; valida al presionar
   - Validación de archivos: tipo (jpg/png/webp) y tamaño (≤4MB)
   - Máximo 4 fotos

4. **Modificar `app/page.tsx`** (feed principal) para:
   - Importar `CreatePostModal`
   - Agregar estado `isCreatePostModalOpen`
   - Botón para abrir el modal (agregar si no existe)
   - Renderizar `<CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)} />`

5. **Probar flujo completo**:
   - Abrir modal → se muestra con fondo oscuro 0.8
   - Intentar publicar sin llenar campos → errores aparecen
   - Seleccionar niño y tipo → se ven seleccionados
   - Escribir descripción → campo se llena
   - Adjuntar fotos → preview aparece, máximo 4
   - Adjuntar archivo inválido → error de tipo/tamaño
   - Eliminar foto del preview → foto se quita
   - Click en "Publicar" con datos válidos → console.log + modal se cierra
   - Click en "Cancelar" → modal se cierra
   - Click fuera del modal → NO se cierra

---

## Acceptance criteria

- [ ] El modal se abre con fondo overlay de opacidad 0.8
- [ ] El campo "Para" muestra todos los niños de `children.ts` + "Toda la sala"
- [ ] Solo se puede seleccionar un niño a la vez (radio buttons)
- [ ] El campo "Tipo" muestra 7 opciones: Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio
- [ ] Solo se puede seleccionar un tipo a la vez (radio buttons)
- [ ] Cada tipo de publicación tiene su color de fondo y texto según el mockup
- [ ] El campo "Descripción" es un textarea obligatorio
- [ ] El campo "Fotos" usa `<input type="file">` real
- [ ] Solo se permiten archivos jpg, png y webp
- [ ] Cada foto no puede exceder 4MB
- [ ] Se pueden adjuntar máximo 4 fotos
- [ ] Las fotos seleccionadas muestran preview con opción de eliminar
- [ ] Todos los campos muestran error cuando están vacíos al presionar "Publicar"
- [ ] Los archivos inválidos muestran error de tipo o tamaño
- [ ] El botón "Publicar" está siempre habilitado; al presionarlo valida y muestra errores
- [ ] Al presionar "Publicar" con datos válidos se hace console.log con los datos
- [ ] Al presionar "Publicar" el modal se cierra
- [ ] El botón "Cancelar" superior cierra el modal
- [ ] Click fuera del modal NO cierra el modal
- [ ] El diseño replica fielmente el mockup `crear-publicacion.dc.html`
- [ ] Los colores coinciden: fondo overlay #000 con opacidad 0.8, cards #FBF4EC, bordes #EADFD0
- [ ] El modal es responsive: fullscreen en móvil (<768px), centrado en desktop

---

## Decisions

- **Sí:** Expandir `PostType` existente en lugar de crear un tipo nuevo. Mantiene coherencia con el modelo de datos.
- **Sí:** Input file real para fotos. El usuario solicitó funcionalidad de upload.
- **Sí:** Imágenes estándar (jpg, png, webp) con máximo 4MB por foto. Suficiente para uso en guardería.
- **Sí:** Máximo 4 fotos como en el mockup. Reasonable para una publicación.
- **Sí:** Validación al presionar "Publicar" (no en tiempo real). Consistente con specs anteriores.
- **Sí:** Botón "Publicar" siempre habilitado; valida al presionar y muestra errores. Consistente con SPEC 04.
- **Sí:** Click fuera del modal NO cierra el modal. Lo especificó el usuario deliberadamente (a diferencia de SPEC 04).
- **Sí:** Fondo overlay con opacidad 0.8 según especificación del usuario.
- **Sí:** Datos mock de niños desde `children.ts`. Reutiliza infraestructura existente.
- **Sí:** Botón "Cancelar" cierra el modal. Comportamiento estándar.
- **Sí:** Preview de fotos con opción de eliminar. Mejor UX que solo mostrar nombre del archivo.
- **No:** Persistencia de publicaciones. El botón "Publicar" solo hace console.log.
- **No:** Validación en tiempo real de campos. Solo al presionar "Publicar".
- **No:** Bibliotecas externas de formularios. Para 4 campos no vale la pena.
- **No:** Animaciones complejas de apertura/cierre. Solo transición CSS básica si es necesario.
- **No:** Drag and drop para fotos. Input file estándar es suficiente.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Input file se ve diferente en cada navegador | Usar CSS para estilizar, aceptar diferencias mínimas |
| Fotos pueden ser muy grandes para preview | Crear objectURL para preview, no cargar en memoria |
| Validación de archivos puede ser bypassed | Validar también en el handler del input, no solo al enviar |
| Modal no es accessible (teclado, screen reader) | Usar focus trap básico y aria attributes |
| Click fuera del modal puede causar confusión | El usuario deliberadamente pidió que NO se cierre, documentar en decisions |
| PostType existente puede romperse al expandir | Verificar que los componentes que usan PostType aceptan los nuevos valores |

---

## What is **not** in this spec

- Persistencia de publicaciones
- Edición de publicaciones existentes
- Eliminación de publicaciones
- Sistema de likes y comentarios
- Notificaciones a padres
- Feed infinito o paginación
- Filtros de publicaciones
- Compartir publicaciones externamente
- Conexión a base de datos o API
- Sistema de autenticación
- Drag and drop para fotos
- Crop o edición de imágenes
