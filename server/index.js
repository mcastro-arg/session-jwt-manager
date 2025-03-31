
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configuración de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Cliente Redis
let redisClient;

// Conectar a Redis
async function connectRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
    // Intentar reconectar en 5 segundos
    setTimeout(connectRedis, 5000);
  }
}

// Iniciar conexión a Redis
connectRedis();

// Middleware para verificar que Redis esté conectado
const checkRedisConnection = (req, res, next) => {
  if (!redisClient || !redisClient.isReady) {
    return res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'Redis connection is not established'
    });
  }
  next();
};

// Endpoint para crear una sesión
app.post('/api/session', checkRedisConnection, async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'API Key is required'
      });
    }

    // Realizar solicitud a API externa (simulada aquí)
    try {
      // En una implementación real, deberías usar la URL de tu API externa
      const apiResponse = await axios.post('https://api.example.com/auth', {
        key: apiKey
      });

      // Extraer JWT y configuraciones de estilo de la respuesta
      const { jwt, styleConfig } = apiResponse.data;

      if (!jwt) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid API key or JWT not received'
        });
      }

      // Crear ID de sesión único
      const sessionId = uuidv4();
      
      // Crear objeto de sesión para almacenar
      const sessionData = {
        jwt,
        styleConfig,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 // 1 hora en milisegundos
      };

      // Guardar en Redis con expiración de 1 hora
      await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        {
          EX: 3600 // 1 hora en segundos
        }
      );

      // Devolver ID de sesión y tiempo de expiración
      return res.status(201).json({
        success: true,
        sessionId,
        expiresAt: new Date(sessionData.expiresAt).toISOString(),
        message: 'Session created successfully'
      });
    } catch (error) {
      console.error('External API error:', error.message);
      
      // Si es un error de la API externa, enviamos una respuesta específica
      return res.status(502).json({
        success: false,
        error: 'Bad Gateway',
        message: 'Error communicating with external API',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error creating session'
    });
  }
});

// Endpoint para validar una sesión
app.post('/api/validate', checkRedisConnection, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Session ID is required'
      });
    }

    // Obtener datos de la sesión desde Redis
    const sessionData = await redisClient.get(`session:${sessionId}`);

    if (!sessionData) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Session not found or expired'
      });
    }

    // Parsear datos de la sesión
    const session = JSON.parse(sessionData);

    // Verificar si la sesión ha expirado
    if (session.expiresAt < Date.now()) {
      // Eliminar sesión expirada
      await redisClient.del(`session:${sessionId}`);
      
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Session expired'
      });
    }

    // Actualizar el tiempo de expiración (opcional, según tus requisitos)
    // Aquí podrías implementar un "sliding expiration" si lo deseas
    
    // Devolver información de la sesión (excepto el JWT por seguridad)
    return res.status(200).json({
      success: true,
      valid: true,
      sessionData: {
        styleConfig: session.styleConfig,
        expiresAt: new Date(session.expiresAt).toISOString()
      },
      message: 'Session is valid'
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error validating session'
    });
  }
});

// Middleware para proteger rutas con validación de sesión
const validateSession = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Session ID is required'
      });
    }

    // Verificar sesión en Redis
    const sessionData = await redisClient.get(`session:${sessionId}`);

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired session'
      });
    }

    // Parsear datos de la sesión
    const session = JSON.parse(sessionData);

    // Verificar si la sesión ha expirado
    if (session.expiresAt < Date.now()) {
      // Eliminar sesión expirada
      await redisClient.del(`session:${sessionId}`);
      
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Session expired'
      });
    }

    // Agregar datos de la sesión a req para uso en los controladores
    req.session = {
      ...session,
      id: sessionId
    };

    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Error in session validation middleware'
    });
  }
};

// Ruta protegida de ejemplo que utiliza el middleware de validación
app.get('/api/protected', checkRedisConnection, validateSession, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'You have access to protected resource',
    user: {
      jwt: req.session.jwt.substring(0, 10) + '...',  // No devolver el JWT completo
      styleConfig: req.session.styleConfig
    }
  });
});

// Manejo de cierre de conexiones
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  
  if (redisClient && redisClient.isReady) {
    await redisClient.quit();
    console.log('Redis connection closed');
  }
  
  process.exit(0);
};

// Escuchar señales para cierre graceful
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
