const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.INFO,
});

module.exports = kafka;