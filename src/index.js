require("dotenv").config();
const express = require("express");
const logger = require("./utils/logger");
const { emailConsumer } = require("./consumers/email.consumers");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  logger.debug("Health check solicitado");
  res.status(200).json({ status: "OK", service: "email-service" });
});

async function startService() {
  try {
    logger.info("Iniciando Email Service...");

    // Conectar al consumer de Kafka
    await emailConsumer();
    logger.info("Consumer de Kafka conectado exitosamente");
  } catch (error) {
    logger.error("Error iniciando email-service", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

const port = process.env.PORT || 3002;

const server = app.listen(port, () => {
  logger.info(`Email-service API corriendo en http://localhost:${port}`);
});

// Iniciar el consumer
startService().catch((error) => {
  logger.error("Error en startService", { error: error.message });
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM recibido, iniciando shutdown graceful...");
  try {
    await disconnectConsumer();
    server.close(() => {
      logger.info("Email-service desconectado correctamente");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Error durante shutdown", { error: error.message });
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("SIGINT recibido, iniciando shutdown graceful...");
  try {
    await disconnectConsumer();
    server.close(() => {
      logger.info("Email-service desconectado correctamente");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Error durante shutdown", { error: error.message });
    process.exit(1);
  }
});
