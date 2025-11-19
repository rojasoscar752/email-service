const kafka = require("../config/kafka");
const logger = require("../utils/logger");
const { sendReportVisitedEmail } = require("../services/emailService");

const consumer = kafka.consumer({
  groupId: "email-consumer-group",
  sessionTimeout: 30000,
  heartbeatInterval: 10000,
});

async function emailConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "report-visited",
    fromBeginning: false,
  });

  logger.info("Email Service escuchando el tópico: report-visited");

  await consumer.run({
    autoCommit: true,
    autoCommitInterval: 5000,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        logger.info(`Evento recibido desde Kafka ${JSON.stringify(data)}`);

        await sendReportVisitedEmail(data);
        logger.info(
          `Procesado evento y enviado email a ${process.env.EMAIL_USER}`
        );
      } catch (err) {
        logger.error(
          "Error procesando mensaje de consumer" +
            {
              error: err.message,
              stack: err.stack,
            }
        );
      }
    },
  });
}

module.exports = { emailConsumer };
