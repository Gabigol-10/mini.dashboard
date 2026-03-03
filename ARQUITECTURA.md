# Arquitectura del Mini Dashboard

## Estructura del Proyecto

```
src/
├── components/          # Componentes React organizados por responsabilidad
│   ├── common/         # Componentes reutilizables (Badge, Button, TextField, StatCard)
│   ├── layout/         # Componentes de estructura (Header)
│   └── projects/       # Componentes específicos de proyectos
│       ├── ProjectDetail.tsx
│       ├── ProjectForm.tsx
│       └── ProjectList.tsx
├── hooks/              # Custom hooks para lógica de estado
│   ├── useDashboard.ts
│   ├── useCreateProject.ts
│   └── useToggleProject.ts
├── services/           # Lógica de negocio y llamadas API
│   └── dashboardService.ts
├── utils/              # Funciones utilitarias puras
│   ├── formatters.ts   # Formateo de datos (money)
│   ├── helpers.ts      # Helpers generales (classNames)
│   └── validators.ts   # Validaciones de formularios
├── pages/              # Páginas principales
│   └── DashboardPage.tsx
└── App.tsx             # Punto de entrada principal
```

## Separación de Responsabilidades

### 1. Services (Capa de Datos)
- **Ubicación**: `src/services/`
- **Responsabilidad**: Manejo de datos, API simulada, lógica de negocio
- **Sin dependencias de**: React, hooks, componentes
- **Tipos exportados**: User, Stats, Project, DashboardResponse, CreateProjectPayload, ApiError

### 2. Utils (Utilidades)
- **Ubicación**: `src/utils/`
- **Responsabilidad**: Funciones puras reutilizables
- **Características**:
  - Sin estado
  - Sin efectos secundarios
  - Completamente tipadas
  - Sin dependencias de React

### 3. Hooks (Lógica de Estado)
- **Ubicación**: `src/hooks/`
- **Responsabilidad**: Encapsular lógica de estado y efectos
- **Características**:
  - Manejo de loading, errores y datos
  - Comunicación con services
  - Reutilizables y desacoplados
  - Tipado estricto

### 4. Components (UI)
- **Ubicación**: `src/components/`
- **Responsabilidad**: Presentación y UI
- **Organización**:
  - `common/`: Componentes genéricos reutilizables
  - `layout/`: Estructura de la aplicación
  - `projects/`: Componentes específicos del dominio

### 5. Pages (Páginas)
- **Ubicación**: `src/pages/`
- **Responsabilidad**: Composición de componentes y orquestación
- **Características**:
  - Conecta hooks con componentes
  - Maneja estado de la página
  - Coordina flujos de datos

## Flujo de Datos

```
User Interaction
      ↓
   Component
      ↓
   Custom Hook
      ↓
    Service
      ↓
  API/Database
```

## Principios Aplicados

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad clara
2. **Reutilización**: Componentes y hooks diseñados para ser reutilizables
3. **Tipado Estricto**: TypeScript sin uso de `any`
4. **Desacoplamiento**: Las capas no dependen de implementaciones específicas
5. **Testabilidad**: Funciones puras y componentes aislados facilitan testing

## Ventajas de esta Arquitectura

- ✅ Fácil de mantener y escalar
- ✅ Código organizado y predecible
- ✅ Componentes reutilizables
- ✅ Lógica de negocio separada de UI
- ✅ Fácil de testear
- ✅ Onboarding más rápido para nuevos desarrolladores
