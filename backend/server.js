const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorHandler");

const documentRoutes = require("./routes/documentRoutes");
const annotationRoutes = require("./routes/annotationRoutes");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/annotations", annotationRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

connectDB();

const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("joinDoc", (docId) => socket.join(`doc:${docId}`));
  socket.on("leaveDoc", (docId) => socket.leave(`doc:${docId}`));
});

module.exports = { io };

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
