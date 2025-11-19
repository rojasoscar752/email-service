const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendReportVisitedEmail(eventData) {
  const { ipAddress, method, path, timestamp } = eventData;

  const colombiaTime = new Date(timestamp).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  logger.debug("Iniciando proceso de envío de email", {
    ipAddress,
    method,
    path,
    timestamp,
  });

  const emailContent = `
    <h2>Reporte de Visita</h2>
    <p><strong>Dirección IP:</strong> ${ipAddress}</p>
    <p><strong>Método HTTP:</strong> ${method}</p>
    <p><strong>Ruta:</strong> ${path}</p>
    <p><strong>Timestamp:</strong> ${colombiaTime}</p>
  `;

  try {
    const mailOptions = {
      from: `"Quejas Boyacá" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: "Reporte de Visita del Sistema",
      html: emailContent,
    };

    logger.debug("Enviando email", {
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);

    logger.info("Email enviado exitosamente", {
      to: mailOptions.to,
      messageId: info.messageId,
      response: info.response,
      ipAddress,
      path,
    });
  } catch (error) {
    logger.error("Error enviando email", {
      error: error.message,
      stack: error.stack,
      ipAddress,
      path,
      to: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
    });
    throw error;
  }
}

module.exports = {
  sendReportVisitedEmail,
};
