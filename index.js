const serverless = require("serverless-http");
const express = require("express");
const sum = require("./utils");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/sum", function (req, res) {
  const a = req.body?.a;
  const b = req.body?.b;

  // Simulate an error condition
  if (a === undefined || b === undefined) {
    const error = new Error("Missing required parameters 'a' and 'b'");
    console.error(error.message);
    return res.status(400).json({ status: "error", message: error.message });
  }

  const result = {
    message: sum(a, b),
    status: "ok",
  };

  res.send(result);
});

module.exports.handler = serverless(app);
