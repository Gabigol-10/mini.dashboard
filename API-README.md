# 🌐 API Demo - JSONPlaceholder

Implementación profesional de consumo de API REST usando JSONPlaceholder.

## 📡 Endpoints Utilizados

### 1. Obtener Usuarios
```
GET https://jsonplaceholder.typicode.com/users
```
**Respuesta:** Lista de 10 usuarios con información completa.

### 2. Obtener Posts de un Usuario
```
GET https://jsonplaceholder.typicode.com/posts?userId={ID}
```
**Parámetros:**
- `userId`: ID del usuario (1-10)

**Respuesta:** Lista de posts del usuario especificado.

### 3. Obtener Detalle de un Post
```
GET https://jsonplaceholder.typicode.com/posts/{ID}
```
**Parámetros:**
- `ID`: ID del post

**Respuesta:** Objeto con el post completo.

### 4. Obtener Comentarios de un Post
```
GET https://jsonplaceholder.typicode.com/comments?postId={ID}
```
**Parámetros:**
- `postId`: ID del post

**Respuesta:** Lista de comentarios del post.

---

## 🧪 Cómo Probar Estados de Error

### Probar Error 404 / 500

1. Abre el archivo: `src/services/apiClient.ts`
2. Cambia la `BASE_URL` temporalmente:

```typescript
// URL inválida para simular error
const BASE_URL = "https://jsonplaceholder.typicode.com-invalid";
```

3. Recarga la aplicación
4. Verás el estado de error con el botón "Reintentar"

### Restaurar URL Correcta

```typescript
const BASE_URL = "https://jsonplaceholder.typicode.com";
```

---

## 📭 Cómo Probar Estado Empty

### Opción 1: Usuario sin Posts

Modifica temporalmente el endpoint en `UserPostsPage.tsx`:

```typescript
// Usar un userId que no existe
() => apiClient.get(`/posts?userId=99999`)
```

### Opción 2: Post sin Comentarios

Algunos posts tienen pocos o ningún comentario. Navega por diferentes posts para encontrar uno vacío.

---

## 🏗️ Arquitectura Implementada

### Capas de la Aplicación

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (UsersPage, PostsPage, etc.)       │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│         Custom Hooks                │
│         (useFetch)                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│       Services Layer                │
│       (apiClient)                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│      HTTP Client (fetch)            │
│   JSONPlaceholder API               │
└─────────────────────────────────────┘
```

### Separación de Responsabilidades

**1. Components (UI Layer)**
- Solo renderizan UI
- Reciben datos via hooks
- Disparan eventos
- NO hacen fetch directamente

**2. Custom Hooks (Logic Layer)**
- Manejan estados (loading, error, data)
- Coordinan llamadas a servicios
- Exponen funciones de refetch
- Optimizan re-renders

**3. Services (API Layer)**
- Cliente HTTP centralizado
- Manejo de errores estructurado
- Configuración de baseURL
- Transformación de respuestas

---

## 🎯 Estados de UI Implementados

Todas las páginas manejan 4 estados:

### 1️⃣ Loading
```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### 2️⃣ Error
```typescript
if (error) {
  return (
    <ErrorBox>
      <p>{error.message}</p>
      <Button onClick={refetch}>Reintentar</Button>
    </ErrorBox>
  );
}
```

### 3️⃣ Empty
```typescript
if (!data || data.length === 0) {
  return <EmptyState />;
}
```

### 4️⃣ Success
```typescript
return <DataDisplay data={data} />;
```

---

## 🔄 Manejo de Errores

### Tipos de Errores Manejados

1. **Error HTTP (404, 500, etc.)**
   ```typescript
   {
     status: 404,
     message: "HTTP 404: Not Found"
   }
   ```

2. **Error de Red**
   ```typescript
   {
     status: 0,
     message: "Error de red. Verifica tu conexión."
   }
   ```

### Retry Mechanism

Cada página con error muestra un botón "Reintentar" que:
- Llama a `refetch()` del hook `useFetch`
- Vuelve a intentar la petición
- Actualiza los estados automáticamente

---

## 📂 Estructura de Archivos

```
src/
├── services/
│   └── apiClient.ts          # Cliente HTTP centralizado
├── types/
│   └── api.ts                # Tipos TypeScript de la API
├── hooks/
│   └── useFetch.ts           # Hook reutilizable para fetch
├── pages/
│   ├── ApiDemoPage.tsx       # Página principal de navegación
│   ├── UsersPage.tsx         # Lista de usuarios
│   ├── UserPostsPage.tsx     # Posts de un usuario
│   └── PostDetailPage.tsx    # Detalle de post + comentarios
└── components/
    └── common/
        └── Button.tsx        # Componente de botón reutilizable
```

---

## 🚀 Características Implementadas

✅ Cliente HTTP centralizado
✅ Manejo de estados (loading, error, empty, success)
✅ Retry mechanism en errores
✅ TypeScript con tipos completos
✅ Arquitectura en capas
✅ Componentes limpios (sin fetch directo)
✅ Hooks reutilizables
✅ Navegación entre vistas
✅ UI profesional y responsive
✅ Manejo de errores estructurado

---

## 🎨 Flujo de Usuario

1. **Página de Usuarios**
   - Ver lista de 10 usuarios
   - Click en "Ver Posts" → Navega a posts del usuario

2. **Página de Posts**
   - Ver posts del usuario seleccionado
   - Click en "Ver detalle" → Navega al detalle del post
   - Click en "Volver" → Regresa a usuarios

3. **Página de Detalle**
   - Ver post completo
   - Ver comentarios del post
   - Click en "Volver" → Regresa a posts

---

## 🔧 Tecnologías Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Fetch API** - HTTP requests
- **Custom Hooks** - Lógica reutilizable
- **JSONPlaceholder** - API pública de prueba

---

## 📝 Notas Técnicas

### ¿Por qué no usar axios?

Se usa `fetch` nativo porque:
- Es estándar del navegador
- No requiere dependencias externas
- Suficiente para este caso de uso
- Más ligero

### ¿Por qué no usar React Router?

Se implementó navegación con estado local porque:
- Proyecto pequeño
- Menos dependencias
- Más control sobre el flujo
- Más fácil de entender

### Optimizaciones Implementadas

- `useCallback` en hooks para evitar re-renders
- `AbortController` para cancelar peticiones
- Prevención de memory leaks
- Estados locales optimizados

---

## 🎓 Aprendizajes Clave

1. **Separación de responsabilidades** es fundamental
2. **Custom hooks** hacen el código más limpio
3. **Manejo de estados** debe ser explícito
4. **Errores** deben ser informativos para el usuario
5. **TypeScript** previene muchos bugs

---

## 🔗 Referencias

- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)
- [React Hooks](https://react.dev/reference/react)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [TypeScript](https://www.typescriptlang.org/)
