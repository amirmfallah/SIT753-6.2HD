const serverless = require("serverless-http");
const express = require("express");
const sum = require("./utils");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/sum", function (req, res) {
  const a = req.body?.a;
  const b = req.body?.b;

  const result = {
    message: sum(a, b),
    status: "ok",
  };

  res.send(result);
});

module.exports.handler = serverless(app);
