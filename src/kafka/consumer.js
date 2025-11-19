const kafka = require('../config/kafka');
const logger = require('../utils/logger');

const consumer = kafka.consumer({ groupId: 'email-service-group' });

const REPORT_VISITED_TOPIC = 'report-visited';

async function connectConsumer() {
  try {
    await consumer.connect();
    logger.info('Kafka Consumer conectado correctamente');
  } catch (error) {
    logger.error('Error conectando Kafka Consumer', { error: error.message });
    throw error;
  }
}

async function subscribeToReportVisited(emailHandler) {
  try {
    await consumer.subscribe({ topic: REPORT_VISITED_TOPIC });
    logger.info(`Suscrito al topic: ${REPORT_VISITED_TOPIC}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          logger.info(`Evento recibido de ${topic}`, {
            partition,
            offset: message.offset,
            data,
          });
          
          await emailHandler(data);
          logger.info('Email procesado exitosamente', { data });
        } catch (error) {
          logger.error('Error procesando mensaje de Kafka', {
            error: error.message,
            topic,
            partition,
            offset: message.offset,
          });
        }
      },
    });
  } catch (error) {
    logger.error('Error suscribiéndose al topic', {
      error: error.message,
      topic: REPORT_VISITED_TOPIC,
    });
    throw error;
  }
}

async function disconnectConsumer() {
  try {
    await consumer.disconnect();
    logger.info('Kafka Consumer desconectado correctamente');
  } catch (error) {
    logger.error('Error desconectando Kafka Consumer', { error: error.message });
    throw error;
  }
}

module.exports = {
  connectConsumer,
  subscribeToReportVisited,
  disconnectConsumer,
};
