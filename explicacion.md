# 📌 Backend – Final MDW 2025  
API REST construida con **Node.js + Express + TypeScript + MongoDB Atlas** con autenticación JWT, manejo global de errores y arquitectura profesional.

Este backend provee toda la lógica del proyecto **FocusTracker** (gestión de actividades y sesiones por usuario), garantizando seguridad, consistencia y escalabilidad.

---

# 🚀 Tecnologías utilizadas

- **Node.js + Express**
- **TypeScript**
- **MongoDB Atlas (Mongoose)**
- **JWT – JSON Web Tokens**
- **bcrypt** para hash de contraseñas
- **CORS**
- **ts-node-dev** (modo desarrollo)
- Arquitectura *MVC-like* con separación por capas

---

# 📂 Estructura del proyecto

src/
controllers/
auth.controller.ts
actividad.controller.ts
sesion.controller.ts
middlewares/
authJwt.ts
asyncHandler.ts
errorHandler.ts
models/
Usuario.ts
Actividad.ts
Sesion.ts
routes/
auth.routes.ts
actividad.routes.ts
sesion.routes.ts
utils/
ApiError.ts
server.ts

markdown
Copiar código

Cada carpeta cumple un rol claro:

- **controllers** → lógica de negocio
- **routes** → define endpoints
- **middlewares** → autenticación, errores, wrappers
- **models** → esquemas de Mongoose
- **utils** → utilidades compartidas

---

# 🔐 Autenticación

El backend utiliza **JWT** para autenticación mediante:

- `POST /api/auth/register`  
- `POST /api/auth/login`

Al hacer login, se genera un JWT con:

```json
{
  "id": "id_del_usuario",
  "email": "usuario@example.com"
}
El token debe enviarse en cada request protegido:

makefile
Copiar código
Authorization: Bearer TU_TOKEN
🛡 Middleware verifyToken
Archivo: middlewares/authJwt.ts

Funciona así:

Verifica que exista el header Authorization.

Checkea el formato Bearer <token>.

Decodifica el token con jwt.verify.

Maneja:

Token faltante → 401

Token mal formado → 401

Token inválido → 401

Token expirado → 401 "Token expirado"

Carga req.user = { id, email }.

Esto asegura que cada usuario solo puede acceder a sus propios datos.

⚠️ Manejo global de errores
Implementado mediante:

ApiError → clase base de errores personalizados

asyncHandler → elimina try/catch repetidos

errorHandler → middleware final que envuelve TODAS las respuestas de error

Formato de error unificado:

json
Copiar código
{ "message": "Descripción del error" }
Esto garantiza:

✔ Consistencia
✔ Seguridad (no se exponen detalles internos)
✔ Simplicidad en el frontend

🧩 Modelos principales
Usuario
nombre

email (único)

password (hash bcrypt)

Actividad
usuarioId (referencia al usuario autenticado)

nombre

categoria

color

activa (baja lógica)

Sesión
usuarioId

actividadId

fecha

duracionMinutos

nota (opcional)

📘 Endpoints disponibles
🔑 Auth
POST /api/auth/register
Crea un nuevo usuario.

Body:

json
Copiar código
{
  "nombre": "Mateo",
  "email": "mateo@example.com",
  "password": "123456"
}
POST /api/auth/login
Devuelve un token JWT + datos del usuario.

🟦 Actividades (todas requieren JWT)
GET /api/actividades
Retorna todas las actividades activas del usuario.

POST /api/actividades
Crea una actividad.

Body:

json
Copiar código
{
  "nombre": "Estudiar",
  "categoria": "Academico",
  "color": "#4f46e5"
}
PUT /api/actividades/:id
Actualiza una actividad del usuario.

DELETE /api/actividades/:id
Baja lógica (marca activa: false).

🟧 Sesiones (todas requieren JWT)
GET /api/sesiones
Retorna todas las sesiones del usuario.

POST /api/sesiones
Crea una sesión.

Body ejemplo:

json
Copiar código
{
  "actividadId": "67ab4c82f0298d5f39f37417",
  "fecha": "2025-12-11T20:00:00.000Z",
  "duracionMinutos": 60,
  "nota": "Sesión de estudio"
}
DELETE /api/sesiones/:id
Elimina una sesión del usuario.

🔒 Seguridad implementada
Hash de contraseñas con bcrypt.

JWT con expiración.

Verificación completa del token.

Validación fuerte de campos obligatorios.

Multiusuario real:
ningún usuario puede acceder/modificar datos de otro.

Baja lógica en actividades (no se pierde información accidentalmente).

🔧 Scripts disponibles
Correr en modo desarrollo:
bash
Copiar código
npm run dev
Construir TypeScript:
bash
Copiar código
npm run build
Ejecutar versión compilada:
bash
Copiar código
npm start
🌐 Conexión a MongoDB Atlas
Usa variables de entorno en .env:

ini
Copiar código
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu_secreto
PORT=3000
🧪 Testing manual recomendado (Postman)
Register → OK

Login → obtener token

Intentar acceder a actividades sin token → 401 OK

Crear actividad con token → OK

Crear sesión → OK

Listar sesiones → OK

Probar error: duración negativa → 400

Probar token expirado → 401 + logout automático en frontend