require("dotenv").config();
const express = require("express");
const { Kafka } = require("kafkajs");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const kafka = new Kafka({
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "email-service-group" });


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


async function sendEmail({ to, subject, message }) {
  await transporter.sendMail({
    from: `"Quejas Boyacá" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: message
  });
}

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "email-notification" });

  console.log("Escuchando topic email-notification...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("Evento recibido:", data);

      await sendEmail(data);
      console.log("Correo enviado a:", data.to);
    }
  });
}

app.listen(3002, () => {
  console.log("Email-service API en http://localhost:3002");
});


startConsumer().catch(console.error);
