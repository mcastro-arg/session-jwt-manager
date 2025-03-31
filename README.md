
# Session JWT Manager

Este proyecto implementa un gestor de sesiones JWT con Express y Redis que:

- Recibe una key por POST HTTPS
- Se comunica con una API externa para obtener un token JWT
- Obtiene configuraciones de estilo desde la API
- Crea una sesión y la persiste en Redis
- Devuelve un identificador de sesión con 1 hora de expiración
- Valida el identificador en cada solicitud

## Estructura del proyecto

- `server/`: Contiene la implementación del servidor Express
- `src/`: Contiene la interfaz de usuario React para probar la funcionalidad

## Requisitos

- Node.js v14+
- Redis (para desarrollo local)
- Docker y Docker Compose (opcional, para despliegue)

## Configuración

1. Clona este repositorio
2. Configura las variables de entorno:
   ```
   cd server
   cp .env.example .env
   ```
3. Edita el archivo `.env` con tus configuraciones

## Ejecución en desarrollo

### Servidor Express:

```bash
cd server
npm install
npm start
```

### Cliente React:

```bash
npm install
npm run dev
```

## Ejecución con Docker

```bash
cd server
docker-compose up -d
```

## Endpoints API

### Crear Sesión

```
POST /api/session
Content-Type: application/json

{
  "apiKey": "tu-api-key"
}
```

Respuesta:

```json
{
  "success": true,
  "sessionId": "uuid-session-id",
  "expiresAt": "2023-01-01T00:00:00.000Z",
  "message": "Session created successfully"
}
```

### Validar Sesión

```
POST /api/validate
Content-Type: application/json

{
  "sessionId": "uuid-session-id"
}
```

Respuesta:

```json
{
  "success": true,
  "valid": true,
  "sessionData": {
    "styleConfig": {
      "theme": "light",
      "primaryColor": "#1a73e8"
    },
    "expiresAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Session is valid"
}
```

### Ruta Protegida

```
GET /api/protected
X-Session-Id: uuid-session-id
```

Respuesta:

```json
{
  "success": true,
  "message": "You have access to protected resource",
  "user": {
    "jwt": "eyJhbGci...",
    "styleConfig": {
      "theme": "light",
      "primaryColor": "#1a73e8"
    }
  }
}
```

## Seguridad

- Las sesiones expiran automáticamente después de 1 hora
- El token JWT nunca se devuelve al cliente en las validaciones
- Se implementa validación de sesiones en cada solicitud a endpoints protegidos

## URL del proyecto Lovable

**URL**: https://lovable.dev/projects/2f2dd14a-cdce-47a4-99cd-213142829fc1
