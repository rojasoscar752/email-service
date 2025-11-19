const kafka = require('../config/kafka');
const { sendEmail } = require('../services/email.service');

const consumer = kafka.consumer({ groupId: 'email-consumer-group' });

async function emailConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'email-notification',
    fromBeginning: false,
  });

  console.log("Email Service escuchando el tópico: email-notification");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      console.log("Evento recibido desde Kafka:", data);

      await sendEmail(data);
    },
  });
}

module.exports = emailConsumer;
