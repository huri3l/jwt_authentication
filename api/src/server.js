require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const db = require("./models");
const routes = require("./routes");

const app = express();
const port = 8080;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

db.sequelize.sync().then((req) => {
  app.listen(port, async () => {
    console.log(`⚡ API listening on: http://localhost:8080`);
  });
});

module.exports = app;
