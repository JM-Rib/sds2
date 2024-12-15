import express from 'express';
const app = express();
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";
import {CLIENT_URL} from "./config.js";
import {JwtService} from "./Services/JwtService.js";

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);

app.post('/new-room', async (req, res) => {
    try {
        const {name, surname} = req.body;
        const token = await JwtService.getToken(name, surname, Date.now())
        res.status(200).json({status: 'success', token: token})
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Something went wrong', error: error.message})
    }
})

app.get('/room/:room', async (req, res) => {
    try {
        const {room} = req.params;
        const verifiedToken = await JwtService.validateToken(room)
        if (verifiedToken.status === 'error') {
            res.status(401).json({status: 'error', message: 'Invalid token'})
        } else {
            res.status(200).json({status: 'success', token: verifiedToken})
        }
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Something went wrong'})
    }
})

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