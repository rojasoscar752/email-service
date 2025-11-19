require('dotenv').config();
const express = require('express');
const config = require('./config/env');
const logger = require('./utils/logger');
const { connectConsumer, subscribeToReportVisited, disconnectConsumer } = require('./kafka/consumer');
const { sendReportVisitedEmail } = require('./services/emailService');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  logger.debug('Health check solicitado');
  res.status(200).json({ status: 'OK', service: 'email-service' });
});

async function startService() {
  try {
    logger.info('Iniciando Email Service...');
    
    // Conectar al consumer de Kafka
    await connectConsumer();
    logger.info('Consumer de Kafka conectado exitosamente');
    
    // Suscribirse al topic report-visited
    await subscribeToReportVisited(sendReportVisitedEmail);
    logger.info('Email-service iniciado y escuchando eventos de Kafka');
    
  } catch (error) {
    logger.error('Error iniciando email-service', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

const server = app.listen(config.port, () => {
  logger.info(`Email-service API corriendo en http://localhost:${config.port}`);
});

// Iniciar el consumer
startService().catch((error) => {
  logger.error('Error en startService', { error: error.message });
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido, iniciando shutdown graceful...');
  try {
    await disconnectConsumer();
    server.close(() => {
      logger.info('Email-service desconectado correctamente');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error durante shutdown', { error: error.message });
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recibido, iniciando shutdown graceful...');
  try {
    await disconnectConsumer();
    server.close(() => {
      logger.info('Email-service desconectado correctamente');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error durante shutdown', { error: error.message });
    process.exit(1);
  }
});
