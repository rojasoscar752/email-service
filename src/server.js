const express = require("express");
const emailRoutes = require("./routes/email.routes");

const app = express();
app.use(express.json());

app.use("/email", emailRoutes);

module.exports = app;
