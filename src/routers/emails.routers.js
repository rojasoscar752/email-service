const express = require("express");
const router = express.Router();

router.post("/send", async (req, res) => {
  return res.json({ message: "Ruta funcionando" });
});

module.exports = router;