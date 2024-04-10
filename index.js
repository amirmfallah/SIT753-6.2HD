const serverless = require("serverless-http");
const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", function (req, res) {
  res.send(`Hello World! from ${process.env.ENV}`);
});

module.exports.handler = serverless(app);
