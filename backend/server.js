const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const {CLIENT_URL} = require("./config");
require('dotenv').config();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data); 
    });
});

server.listen(5000, () => {
    console.log("SERVER IS RUNNING");
});