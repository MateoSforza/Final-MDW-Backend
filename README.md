# Final-MDW-Backend – API de Gestión de Actividades y Tiempo

Backend desarrollado para el proyecto final de **Metodologías de Desarrollo Web**.  
Provee una API REST para gestionar usuarios, actividades y el tiempo dedicado a cada una.

---

## 🔧 Tecnologías principales

- **Node.js + Express**
- **TypeScript**
- **MongoDB Atlas + Mongoose**
- **JWT (jsonwebtoken)** para autenticación
- **bcrypt** para hash de contraseñas
- **cors**, **dotenv**

---

## 📂 Estructura del proyecto

```text
src/
  controllers/
    auth.controller.ts       # Registro y login de usuarios
    actividad.controller.ts  # CRUD de actividades del usuario
  middlewares/
    auth.middleware.ts       # Verificación de JWT y carga de req.user
  models/
    Usuario.ts               # Esquema de usuario
    Actividad.ts             # Esquema de actividad
  routes/
    auth.routes.ts           # /api/auth/*
    actividad.routes.ts      # /api/actividades/*
  server.ts                  # Punto de entrada del servidor
