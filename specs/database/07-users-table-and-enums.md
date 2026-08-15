# SPEC 07 — Crear tabla users, enums y datos de prueba

> **Status:**  Implementado 
> **Depends on:** SPEC 06
> **Date:** 2026-08-14
> **Objective:** Crear la tabla `users` con sus enums, trigger de auto-creación, RLS y datos de prueba en Supabase.

---

## Scope

**In:**

- Crear enums `user_role` y `user_status` necesarios para la tabla `users`
- Crear tabla `users` con campos exactos del esquema de base de datos
- Crear trigger `AFTER INSERT` en `auth.users` para auto-crear fila en `users`
- Activar RLS en tabla `users` con política de owner
- Insertar 5 registros de prueba en tabla `daycares`
- Crear 1 usuario staff real en Supabase Auth (`socratesfv@gmail.com` / `123abc@`) vinculado a un daycare

**Fuera de alcance (specs futuros):**

- Enums adicionales (`relationship_type`, `invitation_status`, `post_type`, `child_status`) — se crearán cuando se implementen las tablas que los usan
- Tablas `rooms`, `children`, `parent_children`, `invitations`, `posts`, etc.
- UI de autenticación (login, registro, perfil)
- Sistema de invitaciones y onboarding de padres
- Migración de datos mock existentes a la base de datos
- Campos adicionales en `daycares` (address, phone, email, logo_url)

---

## Data model

```sql
-- =============================================
-- ENUMS
-- =============================================

-- Roles de usuario en el sistema
CREATE TYPE user_role AS ENUM ('staff', 'parent', 'admin');

-- Estado del usuario (pre-signup se modela en invitations)
CREATE TYPE user_status AS ENUM ('pending', 'active');

-- =============================================
-- TABLA users
-- =============================================

CREATE TABLE users (
  id UUID PRIMARY KEY,
  daycare_id UUID REFERENCES daycares(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'parent',
  status user_status NOT NULL DEFAULT 'active',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  notify_on_post BOOLEAN NOT NULL DEFAULT true,
  daily_summary_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentarios
COMMENT ON TABLE users IS 'Perfil de aplicación vinculado a Supabase Auth. Padres y staff comparten tabla.';
COMMENT ON COLUMN users.id IS 'UUID de Supabase Auth (auth.users). FK con CASCADE DELETE.';
COMMENT ON COLUMN users.daycare_id IS 'Guardería a la que pertenece el usuario';
COMMENT ON COLUMN users.role IS 'Rol: staff, parent o admin';
COMMENT ON COLUMN users.status IS 'Estado: pending (pre-signup) o active';
COMMENT ON COLUMN users.full_name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.avatar_url IS 'URL del avatar (nullable)';
COMMENT ON COLUMN users.notify_on_post IS 'Recibe notificaciones cuando publican';
COMMENT ON COLUMN users.daily_summary_enabled IS 'Recibe resumen diario a las 19:00';

-- =============================================
-- TRIGGER: auto-crear user en auth.users
-- =============================================

-- Función que crea la fila en public.users después del signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, daycare_id, role, full_name)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data ->> 'daycare_id')::UUID,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'parent'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: cada usuario solo ve su propio registro
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política: cada usuario actualiza su propio registro
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_users_daycare_id ON users(daycare_id);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- 5 registros de prueba en daycares
INSERT INTO daycares (id, name) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Guardería Sala Soles'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Guardería Sala Estrellas'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Guardería Sala Lunas'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Guardería Sala Nubes'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Guardería Sala Colores');

-- 1 usuario staff real en Supabase Auth (login con email/password).
-- El trigger handle_new_user crea automáticamente el perfil en public.users
-- (role 'staff', daycare Sala Soles, full_name 'Staff de Prueba').
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'authenticated',
  'authenticated',
  'socratesfv@gmail.com',
  crypt('123abc@', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"daycare_id":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","role":"staff","full_name":"Staff de Prueba"}',
  now(), now(),
  '', ''
);

-- Identidad de email para que el sign-in resuelva el proveedor correctamente
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  jsonb_build_object('sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'email', 'socratesfv@gmail.com'),
  'email',
  now(), now(), now()
);
```

Convenciones:

- PK `id` tipo `uuid` — FK a `auth.users(id)` ON DELETE CASCADE (no tiene default, viene de Auth)
- `daycare_id` FK a `daycares(id)` ON DELETE SET NULL
- Enums en inglés, labels en UI se traducen a español
- `created_at` / `updated_at` tipo `timestamptz` con default `now()`
- RLS activado con políticas de owner (auth.uid() = id)

---

## Implementation plan

1. **Crear enums `user_role` y `user_status`**
   - Ejecutar `CREATE TYPE` para ambos enums via `apply_migration`
   - Verificar que se crearon correctamente

2. **Crear tabla `users`**
   - Ejecutar `CREATE TABLE` con todos los campos del esquema
   - Agregar comentarios en tabla y columnas
   - Verificar que la migración no tiene errores

3. **Crear función y trigger `handle_new_user`**
   - Crear función `SECURITY DEFINER` que inserta en `public.users`
   - Crear trigger `on_auth_user_created` en `auth.users`
   - Verificar que la función existe

4. **Activar RLS y crear políticas**
   - Ejecutar `ALTER TABLE users ENABLE ROW LEVEL SECURITY`
   - Crear política SELECT para que cada usuario vea su perfil
   - Crear política UPDATE para que cada usuario actualice su perfil

5. **Crear índices**
   - Crear índice en `daycare_id` para joins rápidos
   - Crear índice en `role` para filtros por rol

6. **Insertar datos de prueba**
   - Insertar 5 registros en `daycares` con UUIDs fijos
   - Crear el usuario staff real en `auth.users` (email `socratesfv@gmail.com`, password `123abc@` hasheado, email confirmado) con metadata `daycare_id`, `role` y `full_name` — el trigger `handle_new_user` crea el perfil en `users`
   - Insertar la identidad de email en `auth.identities` para el sign-in con password
   - Verificar que los datos se insertaron correctamente

7. **Verificación final**
   - Usar `list_tables` para confirmar que `users` existe
   - Usar `execute_sql` para verificar los datos de prueba
   - Confirmar que RLS está activado

---

## Acceptance criteria

- [ ] Enum `user_role` creado con valores: staff, parent, admin
- [ ] Enum `user_status` creado con valores: pending, active
- [ ] Tabla `users` existe con todos los campos del esquema
- [ ] Campo `id` es UUID PRIMARY KEY (FK a auth.users)
- [ ] Campo `daycare_id` es UUID FK a daycares con ON DELETE SET NULL
- [ ] Campo `role` tiene default 'parent'
- [ ] Campo `status` tiene default 'active'
- [ ] Campo `notify_on_post` tiene default true
- [ ] Campo `daily_summary_enabled` tiene default true
- [ ] Función `handle_new_user` existe y es SECURITY DEFINER
- [ ] Trigger `on_auth_user_created` creado en auth.users
- [ ] RLS está activado en tabla users
- [ ] Política SELECT existe para authenticated (auth.uid() = id)
- [ ] Política UPDATE existe para authenticated (auth.uid() = id)
- [ ] Índice en `daycare_id` creado
- [ ] Índice en `role` creado
- [ ] 5 registros insertados en daycares
- [ ] 1 usuario staff real en auth.users (`socratesfv@gmail.com`) con password hasheado y email confirmado
- [ ] Identidad de email creada en auth.identities para el usuario staff
- [ ] Perfil del usuario staff auto-creado en `users` por el trigger (role staff, daycare Sala Soles)
- [ ] La migración se aplicó sin errores

---

## Decisions

- **Sí:** Crear solo los enums necesarios para `users` (`user_role`, `user_status`). Los demás enums se crean cuando se implementan las tablas que los usan.
- **Sí:** Activar RLS ahora. El SPEC 06 dejó pendiente esto y es crítico para la seguridad de datos de usuario.
- **Sí:** Crear trigger `AFTER INSERT` en `auth.users` para auto-crear la fila. Es el patrón estándar de Supabase para vincular Auth con datos de dominio.
- **Sí:** Usar `ON DELETE SET NULL` en `daycare_id`. Si se elimina un daycare, los usuarios no se eliminan — se desvinculan.
- **Sí:** Datos de prueba con UUIDs fijos. Facilita testing manual y consistente entre ejecuciones.
- **Sí:** Crear el usuario staff como cuenta real en `auth.users` (email/password) en lugar de una fila suelta en `users` sin login. El trigger crea el perfil automáticamente. Migración: `20260814235107_replace_test_staff_user_with_socratesfv`.
- **No:** No crear los otros 4 enums del esquema. Se crearán en specs futuros cuando se implementen las tablas relacionadas.
- **No:** No insertar usuarios parent o admin de prueba. Solo staff es necesario para las primeras pruebas.
- **No:** No migrar datos mock existentes a la base de datos. Se hará en un spec dedicado de migración.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Trigger puede fallar si auth.users ya tiene usuarios | Los usuarios existentes no tendrán fila en users. Se puede migrar manualmente después. |
| RLS puede bloquear inserts directos | La política de owner permite inserts propios. El perfil del staff se crea vía el trigger de auth.users, no con insert directo en users. |
| UUIDs fijos pueden colisionar con datos futuros | Usar rangos altos (1111..., a0ee...) para evitar conflicto con UUIDs generados. |

---

## What is **not** in this spec

- Enums adicionales (`relationship_type`, `invitation_status`, `post_type`, `child_status`)
- Tablas `rooms`, `children`, `parent_children`, `invitations`, `posts`
- UI de autenticación (login, registro, perfil)
- Sistema de invitaciones y onboarding de padres
- Migración de datos mock existentes
- Campos adicionales en `daycares`
- Storage de avatares
- Edge Functions
