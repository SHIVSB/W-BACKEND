var express = require("express");
const PORT = process.env.PORT || 4000;
var path = require("path");
var logger = require("morgan");
var cors = require("cors");
var dbConfig = require("./src/services/dbConfig");
var dotenv = require("dotenv");
dotenv.config();

var apiRouter = require("./routes/api");
dbConfig();
var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/", function (req, res) {
  res.send("Shivanshu");
});
app.use("/api", apiRouter);
// console.log(process);

app.listen(PORT, function (err) {
  if (err) {
    console.log("Error in starting server ..");
  }

  console.log(`Server started successfully on PORT : ${PORT}`);
});