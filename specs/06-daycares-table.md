# SPEC 06 — Crear tabla daycares en Supabase

> **Status:** Implementado
> **Depends on:** Ninguno
> **Date:** 2026-08-14
> **Objective:** Crear la tabla `daycares` en Supabase como entidad raíz del esquema de base de datos.

---

## Scope

**In:**

- Crear tabla `daycares` con campos exactos del esquema de base de datos
- Usar Supabase MCP para aplicar la migración

**Fuera de alcance (specs futuros):**

- RLS (Row Level Security) — se activará cuando se cree la tabla `users`
- Campos adicionales (address, phone, email, logo_url, etc.)
- UI para gestionar daycares
- Integración con la app actual (datos mock se mantienen)
- Crear otras tablas del esquema (users, rooms, children, etc.)

---

## Data model

```sql
-- Crear tabla daycares
CREATE TABLE daycares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentario en la tabla
COMMENT ON TABLE daycares IS 'Guardería como entidad raíz del sistema';
COMMENT ON COLUMN daycares.id IS 'Identificador único de la guardería';
COMMENT ON COLUMN daycares.name IS 'Nombre de la guardería, ej. "Guardería Sala Soles"';
COMMENT ON COLUMN daycares.created_at IS 'Fecha y hora de creación del registro';
```

Convenciones:

- PK `id` tipo `uuid` con default `gen_random_uuid()`
- `created_at` tipo `timestamptz` con default `now()`
- Todo en inglés (campos, tablas)
- Sin RLS por decisión del usuario

---

## Implementation plan

1. **Preparar SQL para la migración**
   - Escribir sentencia CREATE TABLE con los campos del esquema
   - Agregar comentarios en tabla y columnas
   - Verificar que el SQL es válido para PostgreSQL

2. **Aplicar migración usando Supabase MCP**
   - Usar herramienta `apply_migration` con nombre descriptivo
   - Ejecutar el SQL preparado
   - Verificar que no hay errores

3. **Verificar creación con list_tables**
   - Usar herramienta `list_tables` para confirmar que la tabla existe
   - Verificar estructura de columnas
   - Confirmar que RLS está desactivado

---

## Acceptance criteria

- [x] Tabla `daycares` existe en Supabase
- [x] Campo `id` es UUID PRIMARY KEY con default gen_random_uuid()
- [x] Campo `name` es TEXT NOT NULL
- [x] Campo `created_at` es TIMESTAMPTZ NOT NULL con default now()
- [x] RLS está desactivado en la tabla
- [x] La migración se aplicó sin errores
- [x] La tabla aparece en list_tables

---

## Decisions

- **Sí:** Seguir el esquema existente exactamente (id, name, created_at)
- **No:** No activar RLS (el usuario decidió esperar a crear la tabla users)
- **No:** No agregar campos adicionales (address, phone, etc.)
- **No:** No crear UI ni integración con la app (solo esquema)
- **No:** No crear otras tablas del esquema (solo daycares)

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| La tabla puede no ser útil sin RLS ni integración | Es el primer paso del esquema, se integrará después |
| El nombre "daycares" puede confundir con otras tablas futuras | El esquema define claramente esta tabla como entidad raíz |

---

## What is **not** in this spec

- RLS (Row Level Security)
- Campos adicionales a la tabla
- UI para gestionar daycares
- Integración con la app actual
- Crear otras tablas del esquema
- Sistema de autenticación
- Migración de datos mock a la base de datos
