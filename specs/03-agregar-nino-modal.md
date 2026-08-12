# SPEC 03 — Modal de agregar niño con formulario validado

> **Status:** Aprobado
> **Depends on:** SPEC 02
> **Date:** 2026-08-10
> **Objective:** Implementar modal con formulario validado para agregar niños, accesible desde el botón "Agregar niño" en la página de lista de niños.

---

## Scope

**In:**

- Modal con formulario de agregar niño que replica el diseño de `agregar-nino.dc.html`
- Campos obligatorios: nombre completo, fecha de nacimiento (date picker nativo), sala (select), alergias, notas médicas
- Validación de campos obligatorios con borde rojo + mensaje "Campo obligatorio" debajo del campo
- Validación de fecha de nacimiento como fecha válida (no permite fechas inválidas como 31 de febrero)
- Botón "Guardar" deshabilitado (opacidad reducida) hasta que todos los campos obligatorios estén válidos
- Modal solo se cierra con botones "Cancelar" o "Guardar" (no al hacer click fuera)
- Al guardar, el niño se agrega a la lista mock en `data/mock/children.ts`
- Diseño responsive: fullscreen en móvil, modal centrado en desktop

**Fuera de alcance (specs futuros):**

- Funcionalidad de editar niños existentes
- Conexión a base de datos real o API
- Sistema de autenticación de usuarios
- Búsqueda de niños dentro del modal
- Paginación de la lista de niños
- Validación de formato de teléfono o email

---

## Data model

Nuevas estructuras para el formulario de agregar niño:

```typescript
// data/mock/children.ts (actualización)

export interface ChildFormData {
  name: string;
  birthDate: string; // formato YYYY-MM-DD para input type="date"
  room: string;
  allergies?: string;
  medicalNotes?: string;
}

// Función para agregar niño (genera ID automático)
export function addChild(data: ChildFormData): Child {
  const newChild: Child = {
    id: `child-${Date.now()}`,
    name: data.name,
    initials: data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    color: ['#E0654A', '#4A90E0', '#50C878', '#FFB347'][Math.floor(Math.random() * 4)],
    age: calculateAge(data.birthDate),
    room: data.room,
    admissionDate: new Date().toISOString().split('T')[0],
    birthDate: data.birthDate,
    allergies: data.allergies,
    parents: [],
  };
  children.push(newChild);
  return newChild;
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
```

Convenciones:

- `birthDate` en formato YYYY-MM-DD para compatibilidad con `<input type="date">`
- `age` se calcula automáticamente a partir de `birthDate`
- `initials` se generan automáticamente del nombre
- `color` se asigna aleatoriamente de una paleta predefinida
- `admissionDate` es la fecha actual al momento de crear

---

## Implementation plan

1. **Actualizar `data/mock/children.ts`** con interfaz `ChildFormData`, función `addChild` y función auxiliar `calculateAge`. Verificar que la función funciona correctamente en consola.

2. **Crear componente `app/components/AddChildModal.tsx`** con:
   - Estado del modal (abierto/cerrado)
   - Formulario con 5 campos controlados
   - Validación en tiempo real: campos obligatorios no vacíos
   - Validación de fecha válida (usar `!isNaN(Date.parse(value))` para inputs tipo date)
   - Mensajes de error debajo de cada campo con borde rojo
   - Botón "Guardar" deshabilitado hasta que `isFormValid` sea true
   - Diseño responsive según mockup

3. **Modificar `app/ninos/page.tsx`** para:
   - Importar `AddChildModal`
   - Agregar estado `isAddModalOpen`
   - Botón "Agregar niño" tiene `onClick={() => setIsAddModalOpen(true)}`
   - Renderizar `<AddChildModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />`

4. **Probar flujo completo**:
   - Click en "Agregar niño" → modal se abre
   - Intentar guardar sin llenar campos → errores aparecen
   - Llenar todos los campos → botón "Guardar" se habilita
   - Click en "Guardar" → niño se agrega a la lista, modal se cierra
   - Click en "Cancelar" → modal se cierra sin guardar

---

## Acceptance criteria

- [ ] El botón "Agregar niño" en `/ninos` abre el modal
- [ ] El modal muestra los 5 campos del formulario según el mockup
- [ ] Todos los campos son obligatorios con validación en tiempo real
- [ ] El campo fecha de nacimiento usa `<input type="date">` nativo
- [ ] La fecha de nacimiento valida que sea una fecha real (no 31 de febrero, etc.)
- [ ] El campo sala muestra un select con opciones: ["Soles", "Lunas", "Estrellas"]
- [ ] Los campos con error muestran borde rojo + mensaje "Campo obligatorio"
- [ ] El botón "Guardar" está deshabilitado hasta que todos los campos obligatorios sean válidos
- [ ] El botón "Guardar" tiene opacidad reducida cuando está deshabilitado
- [ ] El modal solo se cierra con "Cancelar" o "Guardar"
- [ ] Al hacer click fuera del modal, NO se cierra
- [ ] Al guardar, el niño se agrega a la lista y aparece en el grid
- [ ] El modal es responsive: fullscreen en móvil (<768px), centrado en desktop
- [ ] El diseño replica fielmente el mockup `agregar-nino.dc.html`
- [ ] Los colores coinciden: fondo #F6ECDF, cards #FBF4EC, bordes #EADFD0

---

## Decisions

- **Sí:** Usar `<input type="date">` nativo para el date picker. Es simple, accesible y tiene validación básica del navegador.
- **Sí:** Validación en tiempo real (onChange) para mostrar errores inmediatamente.
- **Sí:** Botón "Guardar" deshabilitado con `disabled` y opacidad CSS. Mejor UX que mostrar error al intentar guardar.
- **Sí:** Modal controlado con estado en el componente padre (`KidsPage`). Facilita la integración con la lista.
- **Sí:** Datos mock en `data/mock/children.ts` con la misma convención que SPEC 02.
- **No:** Bibliotecas externas de formularios (react-hook-form, formik). Para 5 campos no vale la pena la dependencia.
- **No:** Validación de formato de teléfono o email. El mockup no incluye esos campos.
- **No:** Animaciones complejas de apertura/cierre. Solo transición CSS básica si es necesario.
- **No:** Upload de foto del niño. No está en el mockup ni en el alcance.

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Input type="date" se ve diferente en cada navegador | Usar CSS para estilizar, aceptar diferencias mínimas |
| Validación de fecha permite fechas futuras | Agregar validación adicional para no permitir fechas > fecha actual |
| Modal no es accessible (teclado, screen reader) | Usar focus trap básico y aria attributes |
| Estado del formulario se pierde al cerrar modal | El modal se destruye al cerrar, se reinicia al abrir |
| Función calculateAge puede dar resultados inesperados | Validar con casos de borde al implementar |

---

## What is **not** in this spec

- Edición de niños existentes (otro spec)
- Conexión a base de datos o API
- Sistema de autenticación
- Upload de fotos o archivos
- Validación de formato de teléfono/email
- Búsqueda dentro del modal
- Paginación de la lista
- Animaciones complejas de transición
