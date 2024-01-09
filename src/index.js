require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/dbconnection");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes");

connectDB();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cors());
app.use(morgan("common"));
app.use(routes);

const PORT = process.env.PORT || 3010;

const server = app.listen(PORT, () => {
  console.log(`Server is running to port ${PORT}`);
});
