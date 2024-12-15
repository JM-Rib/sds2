import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";
import {nanoid, random} from "nanoid";
import {CLIENT_URL} from "./config.js";

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());

const rooms = {}; // Structure: { roomId: { socketId: { displayName, vote } } }

app.post('/new-room', (req, res) => {
    try {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        // Generate a random room ID with the custom alphabet
        const roomId = nanoid(8, alphabet); // 8 characters, using the custom alphabet
        console.log(roomId)// Generate a random 8-character string
        rooms[roomId] = {};
        console.log(rooms)
        // Initialize room data
        res.status(200).json({ status: 'success', roomId }); // Return roomId, not token
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
    }
});


app.get('/room/:roomId', (req, res) => {
    const { roomId } = req.params;

    if (!rooms[roomId]) {
        return res.status(404).json({ status: 'error', message: 'Room does not exist' });
    }

    res.status(200).json({ status: 'success', roomId });
});

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle user joining a room
    socket.on("join_room", ({ roomId, displayName }) => {
        if (!rooms[roomId]) {
            socket.emit("room_error", { message: "Room does not exist!" });
            return;
        }

        if (!rooms[roomId]) {
            rooms[roomId] = {};
        }

        rooms[roomId][socket.id] = { displayName, vote: 0 }; // Initialize vote as 0
        socket.join(roomId);

        console.log(`User ${socket.id} (${displayName}) joined room ${roomId}`);
        io.to(roomId).emit("room_update", rooms[roomId]); // Notify others in the room
    });

    // Handle vote updates
    socket.on("update_vote", ({ roomId, vote }) => {
        if (rooms[roomId] && rooms[roomId][socket.id]) {
            rooms[roomId][socket.id].vote = vote; // Update vote for the user
            io.to(roomId).emit("room_update", rooms[roomId]); // Broadcast updated room data
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);

        // Remove user from the room
        for (const roomId in rooms) {
            if (rooms[roomId][socket.id]) {
                delete rooms[roomId][socket.id];
                console.log(`User ${socket.id} removed from room ${roomId}`);

                io.to(roomId).emit("room_update", rooms[roomId]); // Notify others in the room
                if (Object.keys(rooms[roomId]).length === 0) {
                    delete rooms[roomId]; // Clean up empty rooms
                }
            }
        }
    });
});

server.listen(5000, () => {
    console.log("SERVER IS RUNNING");
});
