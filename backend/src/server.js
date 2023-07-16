const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const router = require("./routes");

dotenv.config();

const connectionOptions = process.env.DB_CONNECTION_STRING;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(connectionOptions, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to the database!");

    const options = { origin: "*" };
    app.use(cors(options));
    app.get("/", (req, res) =>
      res.send("Welcome to Loan Application Management")
    );
    app.use("/", router);

    app.listen(process.env.PORT, () =>
      console.log(`App listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
