# 🎣 Arquitectura de Custom Hooks

Este proyecto implementa una arquitectura profesional de React con custom hooks reutilizables que separan la lógica de negocio de la presentación.

## 📁 Estructura de Hooks

```
src/hooks/
├── index.ts                 # Barrel export de todos los hooks
├── useFetch.ts             # Hook genérico para peticiones HTTP
├── useForm.ts              # Hook para manejo de formularios
├── useToggle.ts            # Hook para estados booleanos
├── useDashboard.ts         # Hook específico para dashboard
├── useCreateProject.ts     # Hook para crear proyectos
└── useToggleProject.ts     # Hook para toggle de proyectos
```

---

## 🔧 Hooks Genéricos (Reutilizables)

### 1️⃣ useFetch

**Propósito:** Manejo centralizado de peticiones HTTP con estados de loading, error y data.

**Características:**
- ✅ Manejo automático de loading state
- ✅ Manejo de errores
- ✅ Cancelación de peticiones (AbortController)
- ✅ Prevención de memory leaks
- ✅ Función refetch para recargar datos

**Uso:**
```typescript
const { data, loading, error, refetch } = useFetch(
  (signal) => apiGetDashboard({ token }),
  { immediate: true }
);
```

**API:**
- `data: T | null` - Datos de la respuesta
- `loading: boolean` - Estado de carga
- `error: Error | null` - Error si ocurre
- `refetch: () => Promise<void>` - Función para recargar

---

### 2️⃣ useForm

**Propósito:** Gestión centralizada de formularios con validación.

**Características:**
- ✅ Manejo de valores de inputs
- ✅ Validación integrada
- ✅ Manejo de errores por campo
- ✅ Estado de submitting
- ✅ Reset de formulario
- ✅ Limpieza automática de errores al escribir

**Uso:**
```typescript
const {
  values,
  errors,
  submitting,
  handleChange,
  handleSubmit,
  reset
} = useForm({
  initialValues: { email: "", password: "" },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email requerido";
    return errors;
  },
  onSubmit: async (values) => {
    await login(values);
  }
});
```

**API:**
- `values: T` - Valores actuales del formulario
- `errors: Partial<Record<keyof T, string>>` - Errores de validación
- `submitting: boolean` - Estado de envío
- `handleChange: (field, value) => void` - Actualizar campo
- `handleSubmit: (e?) => Promise<void>` - Enviar formulario
- `reset: () => void` - Resetear formulario
- `setFieldError: (field, error) => void` - Establecer error manual
- `clearErrors: () => void` - Limpiar todos los errores

---

### 3️⃣ useToggle

**Propósito:** Manejo simplificado de estados booleanos.

**Características:**
- ✅ Toggle automático
- ✅ Funciones para forzar true/false
- ✅ Optimizado con useCallback

**Uso:**
```typescript
const { value, toggle, setTrue, setFalse } = useToggle(false);

// Alternar
<button onClick={toggle}>Toggle</button>

// Forzar valores
<button onClick={setTrue}>Abrir</button>
<button onClick={setFalse}>Cerrar</button>
```

**API:**
- `value: boolean` - Valor actual
- `toggle: () => void` - Alternar valor
- `setTrue: () => void` - Establecer en true
- `setFalse: () => void` - Establecer en false

---

## 🎯 Hooks Específicos del Dominio

### 4️⃣ useDashboard

**Propósito:** Obtener datos del dashboard con manejo de estados.

**Uso:**
```typescript
const { data, loading, error, reload } = useDashboard(token);
```

**Implementación:**
- Usa `useCallback` para optimizar reload
- Maneja estados de loading, error y data
- Se recarga automáticamente cuando cambia el token

---

### 5️⃣ useCreateProject

**Propósito:** Crear proyectos con manejo de estados.

**Uso:**
```typescript
const { create, saving, error } = useCreateProject(token);

await create({ name, owner, budget, status });
```

**Características:**
- Manejo de estado de guardado
- Captura y muestra errores
- Lanza excepciones para manejo en componentes

---

### 6️⃣ useToggleProject

**Propósito:** Cambiar estado de proyectos (active/paused).

**Uso:**
```typescript
const { toggle, toggling, error } = useToggleProject(token);

await toggle(projectId);
```

---

## 📐 Principios de Arquitectura

### ✅ Separación de Responsabilidades

**Componentes:**
- Solo renderizan UI
- Reciben datos via props
- Disparan eventos

**Hooks:**
- Contienen lógica de negocio
- Manejan estados
- Realizan side effects
- Interactúan con APIs

### ✅ Reutilización

Los hooks genéricos (`useFetch`, `useForm`, `useToggle`) pueden usarse en cualquier proyecto React.

### ✅ Composición

Los hooks específicos del dominio pueden componer hooks genéricos:

```typescript
export function useDashboard(token: string) {
  // Compone useState, useCallback, useEffect
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const load = useCallback(async () => {
    // Lógica de carga
  }, [token]);
  
  useEffect(() => {
    load();
  }, [load]);
  
  return { data, loading, error, reload: load };
}
```

### ✅ TypeScript

Todos los hooks están tipados con TypeScript para:
- Autocompletado en el IDE
- Detección de errores en tiempo de desarrollo
- Documentación implícita

### ✅ Optimización

- Uso de `useCallback` para evitar re-renders innecesarios
- Uso de `useRef` para valores que no causan re-renders
- Limpieza de efectos para prevenir memory leaks
- Cancelación de peticiones HTTP pendientes

---

## 🎨 Ejemplo de Uso en Componente

**Antes (sin hooks):**
```typescript
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validación manual
    // Lógica de login
    // Manejo de errores
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

**Después (con hooks):**
```typescript
function LoginPage() {
  const loginForm = useForm({
    initialValues: { email: "", password: "" },
    validate: validateLogin,
    onSubmit: handleLogin
  });
  
  return (
    <form onSubmit={loginForm.handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

---

## 📊 Beneficios de esta Arquitectura

1. **Código más limpio:** Componentes enfocados solo en UI
2. **Reutilización:** Hooks genéricos usables en todo el proyecto
3. **Testeable:** Hooks pueden testearse independientemente
4. **Mantenible:** Lógica centralizada y organizada
5. **Escalable:** Fácil agregar nuevos hooks
6. **Type-safe:** TypeScript previene errores
7. **Performance:** Optimizaciones con useCallback y useMemo

---

## 🚀 Mejores Prácticas Implementadas

✅ Nombres descriptivos (use + verbo/sustantivo)
✅ Un hook = una responsabilidad
✅ Hooks genéricos en carpeta separada
✅ Barrel exports para imports limpios
✅ TypeScript para type safety
✅ Documentación inline con JSDoc
✅ Manejo de cleanup en useEffect
✅ Prevención de memory leaks
✅ Optimización con useCallback/useMemo

---

## 📚 Referencias

- [React Hooks Documentation](https://react.dev/reference/react)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)
