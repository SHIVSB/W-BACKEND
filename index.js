const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors"); // import the cors module
const dbConfig = require("./src/services/dbConfig");
var dotenv = require("dotenv");
dotenv.config();

const DELAY_MS = 1000;

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dbConfig();

io.on("connection", (socket) => {
  socket.on("addmessage", (message) => {
    setTimeout(() => {
      socket.emit("newmessage", message);
    }, socket?.handshake?.query?.delay * 1000 || DELAY_MS);
  });

  socket.on("image", (base64String) => {
    console.log("Entered");
    const buffer = base64String.toString("base64");
    socket.emit("buffer", buffer);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(cors()); 

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", require("./routes/api"));

app.get("/", function (req, res) {
  res.send("Shivanshu");
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
