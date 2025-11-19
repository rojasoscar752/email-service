const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: [process.env.KAFKA_BROKER],
});

module.exports = kafka;