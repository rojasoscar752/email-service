const emailConsumer = require("../consumers/email.consumer");

async function initKafka() {
  try {
    console.log("Conectando a Kafka...");
    await emailConsumer();
    console.log("Kafka conectado");
  } catch (error) {
    console.error("Error iniciando Kafka:", error);
  }
}

module.exports = initKafka;
