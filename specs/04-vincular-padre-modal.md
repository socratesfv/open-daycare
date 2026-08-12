# SPEC 04 — Modal de vincular padre con formulario validado

> **Status:** Aprobado
> **Depends on:** SPEC 02, SPEC 03
> **Date:** 2026-08-11
> **Objective:** Implementar modal con formulario validado para vincular un padre/madre a un niño, accesible desde el botón "Vincular otro padre" en la página de perfil del niño.

---

## Scope

**In:**

- Modal con formulario de vincular padre que replica el diseño de `vincular-padre.dc.html`
- Campos obligatorios: nombre del padre/madre, email (con validación de formato), parentesco (Mamá/Papá/Tutor/a)
- Código de invitación autogenerado de 5 caracteres alfanuméricos (se muestra pero no se persiste)
- Validación de campos obligatorios al presionar "Enviar invitación"
- Validación de formato de email (debe contener @ y dominio válido)
- Botón "X" superior cierra el modal
- Click fuera del modal cierra el modal
- Fondo con opacidad 0.8 al abrir el modal
- Nombre del niño dinámico en el título del modal
- Diseño responsive: fullscreen en móvil, modal centrado en desktop (mismo patrón que SPEC 03)

**Fuera de alcance (specs futuros):**

- Persistencia de datos del formulario (el botón "Enviar invitación" no guarda nada por ahora)
- Envío real de correo electrónico con código de invitación
- Generación real de códigos de invitación únicos en base de datos
- Validación de que el email no esté ya registrado
- Sistema de expiración de códigos (el "Vence en 7 días" es visual únicamente)
- Historial de invitaciones enviadas

---

## Data model

No se introducen nuevas estructuras de datos persistidas. El código de invitación se genera en tiempo real y se muestra en el modal sin guardarse.

```typescript
// Generación de código de invitación (función auxiliar)
function generateInvitationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

Convenciones:

- Código de 5 caracteres alfanuméricos (letras mayúsculas + números)
- Código se regenera cada vez que se abre el modal
- No se almacena en ningún lado (sin persistencia)

---

## Implementation plan

1. **Crear componente `app/components/LinkParentModal.tsx`** con:
   - Props: `isOpen`, `onClose`, `childName`
   - Estado del formulario controlado con `useState`
   - Generación de código de invitación al montar el componente
   - Fondo overlay con opacidad 0.8
   - Botón "X" que llama `onClose`
   - Click en overlay (fuera del modal) llama `onClose`
   - Diseño responsive según mockup

2. **Implementar formulario con validación**:
   - Campo "Nombre del padre/madre" (input text, obligatorio)
   - Campo "Email" (input email, obligatorio, validación de formato con regex)
   - Campo "Parentesco" (botones toggle: Mamá/Papá/Tutor/a, obligatorio)
   - Mensajes de error debajo de cada campo cuando está vacío o inválido
   - Botón "Enviar invitación" siempre habilitado; al presionarlo valida y muestra errores
   - Al presionar "Enviar invitación" con datos válidos: console.log con los datos y cierre del modal (sin persistencia)

3. **Modificar `app/ninos/[id]/page.tsx`** para:
   - Importar `LinkParentModal`
   - Agregar estado `isLinkParentModalOpen`
   - Botón "Vincular otro padre" tiene `onClick={() => setIsLinkParentModalOpen(true)}`
   - Renderizar `<LinkParentModal isOpen={isLinkParentModalOpen} onClose={() => setIsLinkParentModalOpen(false)} childName={child.name} />`

4. **Probar flujo completo**:
   - Click en "Vincular otro padre" → modal se abre con nombre del niño
   - Intentar enviar sin llenar campos → errores aparecen
   - Ingresar email inválido → error de formato
   - Llenar todos los campos válidos → botón se habilita
   - Click en "Enviar invitación" → console.log con datos
   - Click en "X" → modal se cierra
   - Click fuera del modal → modal se cierra

---

## Acceptance criteria

- [ ] El botón "Vincular otro padre" en `/ninos/[id]` abre el modal
- [ ] El modal muestra el nombre del niño en el título (dinámico)
- [ ] El modal tiene fondo overlay con opacidad 0.8
- [ ] El campo "Nombre del padre/madre" es obligatorio con validación
- [ ] El campo "Email" es obligatorio con validación de formato (@ y dominio)
- [ ] El campo "Parentesco" muestra 3 botones: Mamá, Papá, Tutor/a
- [ ] Los botones de parentesco tienen estados seleccionado/no seleccionado
- [ ] Todos los campos muestran error cuando están vacíos al presionar "Enviar"
- [ ] El campo email muestra error cuando el formato es inválido
- [ ] El botón "Enviar invitación" está siempre habilitado; al presionarlo valida y muestra errores
- [ ] El código de invitación se autogenera (5 caracteres alfanuméricos)
- [ ] El código de invitación se muestra en el recuadro amarillo punteado
- [ ] El botón "X" superior cierra el modal
- [ ] Click fuera del modal cierra el modal
- [ ] Al presionar "Enviar invitación" se hace console.log con los datos
- [ ] El diseño replica fielmente el mockup `vincular-padre.dc.html`
- [ ] Los colores coinciden: fondo overlay oscuro con opacidad 0.8, cards #FBF4EC, bordes #EADFD0
- [ ] El modal es responsive: fullscreen en móvil (<768px), centrado en desktop

---

## Decisions

- **Sí:** Usar `<input type="email">` nativo para validación básica de email + regex adicional para asegurar dominio válido.
- **Sí:** Validación al presionar "Enviar invitación" (no en tiempo real) según lo solicitado por el usuario.
- **Sí:** Botón "Enviar invitación" siempre habilitado; valida al presionar y muestra errores. El usuario eligió esto al resolver la contradicción con el criterio original de botón deshabilitado (que se descartó).
- **Sí:** Fondo overlay con opacidad 0.8 según especificación del usuario.
- **Sí:** Click fuera del modal cierra el modal (a diferencia del SPEC 03 donde no se cerraba).
- **Sí:** Código de invitación de 5 caracteres alfanuméricos como en el mockup.
- **Sí:** Nombre del niño dinámico pasado como prop desde la página de perfil.
- **Sí:** Mismo patrón de responsive que SPEC 03: fullscreen en móvil, modal centrado en desktop.
- **No:** Persistencia de datos. El botón "Enviar invitación" solo hace console.log.
- **No:** Envío real de correos electrónicos.
- **No:** Bibliotecas externas de formularios. Para 3 campos no vale la pena.
- **No:** Animaciones complejas de apertura/cierre. Solo transición CSS básica si es necesario.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Validación de email puede ser bypassada | Usar `type="email"` nativo + regex, es suficiente para UI |
| Código de invitación puede repetirse | No importa ya que no se persiste, se regenera al abrir |
| Fondo overlay 0.8 puede oscurecer demasiado | Testear visualmente, ajustar si es necesario |
| Modal no es accessible (teclado, screen reader) | Usar focus trap básico y aria attributes |
| Click fuera del modal puede causar acciones no deseadas | Usar stopPropagation en el contenido del modal |

---

## What is **not** in this spec

- Persistencia de datos del formulario
- Envío real de correos electrónicos con código
- Generación de códigos únicos en base de datos
- Validación de que el email no esté registrado
- Sistema de expiración de códigos
- Historial de invitaciones enviadas
- Edición de padres existentes
- Conexión a base de datos o API
- Sistema de autenticación
