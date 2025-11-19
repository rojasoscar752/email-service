const kafka = require('../config/kafka');
const logger = require('../utils/logger');
const { sendEmail } = require('../services/email.services');

const consumer = kafka.consumer({ groupId: 'email-consumer-group' });

async function emailConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'report-visited',
    fromBeginning: false,
  });

  logger.info('Email Service escuchando el tópico: report-visited');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        logger.info('Evento recibido desde Kafka', { data });

        await sendEmail(data);
        logger.info('Procesado evento y enviado email', { to: data.to || process.env.EMAIL_ADMIN });
      } catch (err) {
        logger.error('Error procesando mensaje de consumer', { error: err.message, stack: err.stack });
      }
    },
  });
}

module.exports = emailConsumer;
