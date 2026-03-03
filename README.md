# Mini Dashboard - Arquitectura Profesional

Un dashboard moderno construido con React, TypeScript y Vite, aplicando principios de arquitectura limpia y separación de responsabilidades.

## 🚀 Características

- ✅ Arquitectura escalable con separación de capas
- ✅ TypeScript estricto sin uso de `any`
- ✅ Custom hooks para lógica reutilizable
- ✅ Componentes desacoplados y reutilizables
- ✅ Diseño moderno con gradientes y animaciones CSS
- ✅ Estados de loading y error elegantes
- ✅ Validaciones de formularios
- ✅ API simulada con delays y errores aleatorios

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── common/         # Componentes reutilizables (Badge, Button, TextField, StatCard)
│   ├── layout/         # Componentes de estructura (Header)
│   └── projects/       # Componentes específicos de proyectos
├── hooks/              # Custom hooks (useDashboard, useCreateProject, useToggleProject)
├── services/           # Lógica de negocio y API simulada
├── utils/              # Funciones utilitarias (formatters, validators, helpers)
├── pages/              # Páginas principales (DashboardPage)
└── App.tsx             # Punto de entrada
```

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **CSS-in-JS** - Estilos inline con React.CSSProperties

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <tu-repo-url>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🎨 Características Visuales

- Gradientes suaves en componentes
- Transiciones CSS en todas las interacciones
- Efectos hover con elevación
- Estados de focus con anillos de color
- Spinner de loading animado
- Emojis para mejor UX
- Sombras dinámicas
- Diseño responsive

## 🏗️ Arquitectura

### Capas del Proyecto

1. **Services** - Lógica de negocio y llamadas API
2. **Utils** - Funciones puras reutilizables
3. **Hooks** - Lógica de estado y efectos
4. **Components** - Presentación y UI
5. **Pages** - Composición y orquestación

### Principios Aplicados

- Separación de responsabilidades
- Componentes reutilizables
- Tipado estricto
- Desacoplamiento
- Testabilidad

## 📝 Funcionalidades

- 📊 Dashboard con estadísticas (Revenue, Usuarios, Churn)
- ✨ Crear proyectos con validación
- 📋 Listar y filtrar proyectos
- 🔄 Cambiar estado de proyectos (active/paused)
- 🔍 Búsqueda de proyectos
- 🔐 Sistema de autenticación simulado
- ⚠️ Manejo de errores y estados de loading

## 🎯 Credenciales de Prueba

```
Email: admin@demo.com
Password: 123456
Token: demo-token (ya configurado por defecto)
```

## 📚 Documentación Adicional

- [ARQUITECTURA.md](./ARQUITECTURA.md) - Detalles de la arquitectura
- [MEJORAS-VISUALES.md](./MEJORAS-VISUALES.md) - Cambios visuales aplicados

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como ejercicio de refactorización arquitectónica.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
