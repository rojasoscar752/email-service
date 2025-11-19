require('dotenv').config();
const logger = require('../utils/logger');

const config = {
  port: process.env.PORT || 3002,
  kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
  emailHost: process.env.EMAIL_HOST || 'gmail',
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,
  emailAdmin: process.env.EMAIL_ADMIN,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validar variables críticas
const requiredVars = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error('Variables de entorno faltantes', {
    missingVars,
  });
}

logger.info('Configuración cargada', {
  port: config.port,
  kafkaBroker: config.kafkaBroker,
  emailHost: config.emailHost,
  nodeEnv: config.nodeEnv,
  logLevel: config.logLevel,
});

module.exports = config;
