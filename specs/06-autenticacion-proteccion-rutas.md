# SPEC 06 — Autenticación email/password y protección de rutas

> **Status:** Aprobado
> **Depends on:** —
> **Date:** 2026-08-14
> **Objective:** Implementar autenticación con email y contraseña usando Supabase Auth, crear proxy.ts para proteger rutas y cerrar sesión desde la interfaz.

---

## Scope

**In:**

- Login real con Supabase Auth (`signInWithPassword`) usando email y contraseña
- Campo de contraseña conectado al estado del formulario de login existente (actualmente solo tiene email)
- Creación de `proxy.ts` en la raíz del proyecto para refrescar sesión y proteger rutas
- Rutas protegidas: todas excepto `/login` y `/activar-cuenta`
- Redirect a `/login` con query param `?redirect=` para volver a la ruta original después de autenticarse
- Redirect a la ruta original si el usuario ya está autenticado y accede a `/login` o `/activar-cuenta`
- Server action `signOut` para cerrar sesión
- Botón de cerrar sesión en el sidebar

**Fuera de alcance (specs futuros):**

- Recuperación de contraseña ("¿Olvidaste tu contraseña?")
- Registro de usuarios nuevos
- Activación de cuenta con código de invitación
- Verificación de email
- Autenticación social (Google, Apple, etc.)
- Persistencia de datos de usuario (el login solo redirige al feed)
- Múltiples roles y permisos por rol
- Recordar sesión

---

## Data model

No se introducen nuevas estructuras de datos. Se reutiliza la tabla `users` existente (SPEC de base de datos) y el cliente Supabase existente en `utils/supabase/client.ts`.

```typescript
// Flujo de autenticación (pseudocódigo)
// 1. Login: supabase.auth.signInWithPassword({ email, password })
// 2. La sesión se almacena automáticamente en cookies vía @supabase/ssr
// 3. proxy.ts refresca la sesión en cada request
// 4. Cierre de sesión: supabase.auth.signOut()
```

Convenciones:

- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ya definidas en `.env.template`)
- Helper de cliente server-side: `utils/supabase/server.ts` (ya existe)
- Helper de cliente browser: `utils/supabase/client.ts` (ya existe)
- Helper de cliente middleware: `utils/supabase/middleware.ts` (ya existe)

---

## Implementation plan

1. **Actualizar `app/(auth)/login/page.tsx`**:
   - Agregar estado `password` y conectar el campo de contraseña
   - Reemplazar el `<Link href="/">` del botón "Iniciar sesión" por un handler que llame a `signInWithPassword` con `createClient` de `utils/supabase/client.ts`
   - Manejar `redirect` desde `useSearchParams` para volver a la ruta original tras autenticarse
   - Mostrar mensaje de error bajo el formulario cuando las credenciales son incorrectas
   - Estado de carga en el botón mientras se procesa el login

2. **Crear `utils/supabase/server-actions.ts`**:
   - Server action `signOut` que cree el cliente server con `utils/supabase/server.ts`, llame `supabase.auth.signOut()` y redirija a `/login`

3. **Crear `proxy.ts` en la raíz**:
   - Usar el helper `createClient` de `utils/supabase/middleware.ts`
   - Refrescar la sesión con `supabase.auth.getClaims()` en cada request
   - Rutas públicas: `/login` y `/activar-cuenta`
   - Si la ruta es protegida y no hay sesión → redirigir a `/login?redirect=<ruta_actual>`
   - Si la ruta es pública y hay sesión → redirigir a `/` (o a la ruta del query param `redirect`)
   - Exportar `config.matcher` que excluya estáticos (`_next/static`, `_next/image`, `favicon.ico`, imágenes)

4. **Agregar botón de cerrar sesión en `app/components/Sidebar.tsx`**:
   - Llamar al server action `signOut` desde un botón en el sidebar
   - Debe verse en desktop (Sidebar) y en móvil (MobileMenu) si es aplicable

5. **Probar flujo completo**:
   - Ir a `/` sin sesión → redirige a `/login?redirect=/`
   - Login con credenciales correctas → redirige al feed
   - Login con credenciales incorrectas → muestra error
   - Ir a `/login` estando autenticado → redirige al feed
   - Cerrar sesión → redirige a `/login`

---

## Acceptance criteria

- [ ] El campo de contraseña está conectado al estado del formulario
- [ ] El botón "Iniciar sesión" llama a `signInWithPassword` con email y contraseña
- [ ] Credenciales correctas → redirige al feed (o a la ruta del query param `redirect`)
- [ ] Credenciales incorrectas → muestra mensaje de error bajo el formulario
- [ ] El botón muestra estado de carga mientras se procesa el login
- [ ] Se crea `proxy.ts` en la raíz del proyecto
- [ ] Todas las rutas excepto `/login` y `/activar-cuenta` están protegidas
- [ ] Usuario no autenticado en ruta protegida → redirige a `/login?redirect=<ruta>`
- [ ] Usuario autenticado en `/login` o `/activar-cuenta` → redirige a `/` o a la ruta del redirect
- [ ] La sesión se refresca automáticamente en cada request (proxy.ts llama `getClaims`)
- [ ] El botón de cerrar sesión en el sidebar cierra la sesión y redirige a `/login`
- [ ] El flujo completo funciona end-to-end: login → navegar → cerrar sesión → login

---

## Decisions

- **Sí:** Usar `signInWithPassword` de Supabase Auth. Es la forma estándar y el SDK ya está instalado (`@supabase/ssr`).
- **Sí:** Crear `proxy.ts` en la raíz (no `middleware.ts`). Next.js 16 renombró middleware a proxy.
- **Sí:** Usar el helper `createClient` de `utils/supabase/middleware.ts` para el proxy. Ya maneja cookies correctamente.
- **Sí:** Query param `?redirect=` para volver a la ruta original después del login. Patrón estándar de Next.js.
- **Sí:** Redirigir a `/` si el usuario autenticado accede a rutas públicas (excepto si ya hay un redirect pendiente).
- **Sí:** Server action `signOut` en `utils/supabase/server-actions.ts`. Separa la lógica de auth del componente.
- **No:** Recuperación de contraseña. El usuario indicó que solo es login.
- **No:** Registro de usuarios nuevos. Los usuarios son creados por el admin de la guardería (ya existe el trigger `handle_new_user`).
- **No:** Activación de cuenta con código. El usuario indicó que solo es login.
- **No:** Autenticación social. No está en alcance.
- **No:** Persistencia de datos de usuario en el login. Solo se autentica y redirige.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Sesión no se refresca y caduca a mitad de uso | `proxy.ts` llama `getClaims()` en cada request y `@supabase/ssr` renueva cookies automáticamente |
| Usuario accede a `/login` autenticado y se rompe el flujo | Redirigir a `/` o al `redirect` pendiente desde el proxy |
| `redirect` malicioso en el query param | Validar que la ruta sea interna de la app antes de usarla |
| Botón de login presionado dos veces | Deshabilitar el botón con estado de carga durante el `signInWithPassword` |
| El error de credenciales no se muestra por estar en Server Component | El login es Client Component; el error se maneja con estado local |

---

## What is **not** in this spec

- Recuperación de contraseña
- Registro de usuarios nuevos
- Activación de cuenta con código de invitación
- Verificación de email
- Autenticación social (Google, Apple, etc.)
- Persistencia de datos de usuario (solo login)
- Múltiples roles y permisos por rol
- Recordar sesión
