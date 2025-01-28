import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";
import { CLIENT_URL, API_PORT } from "./config.js";

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());

const rooms = {}; // Structure: { roomId: { users: {}, owner: "", state: "waiting" } }

app.post('/new-room', (req, res) => {
    try {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const length = 6;
        let counter = 0;
        let roomId = "";
        while (counter < length) {
            roomId += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            counter += 1;
        }
        rooms[roomId] = { users: {}, owner: "", state: "waiting" };
        console.log(`New Room Created: ${roomId}`);
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

    socket.on("join_room", ({ roomId, displayName }) => {
        if (!rooms[roomId]) {
            socket.emit("room_error", { message: "Room does not exist!" });
            return;
        }

        if (rooms[roomId].state === 'voting') {
            socket.emit("room_error", { message: "Voting is currently in progress. You cannot join the room at this time." });
            return;
        }

        if (!rooms[roomId].owner) {
            rooms[roomId].owner = socket.id;
        }

        rooms[roomId].users[socket.id] = { displayName, vote: 0 }; // Initialize vote as 0
        socket.join(roomId);

        console.log(`User ${socket.id} (${displayName}) joined room ${roomId}`);
        io.to(roomId).emit("room_update", rooms[roomId]); // Notify others in the room
    });

    socket.on("start_round", ({ roomId }) => {
        if (rooms[roomId]?.owner === socket.id) {
            // Reset votes for the next round
            Object.keys(rooms[roomId].users).forEach(socketId => {
                rooms[roomId].users[socketId].vote = "-";
            });
            rooms[roomId].state = 'voting';
            io.to(roomId).emit("room_update", rooms[roomId]);
        }
    });

    socket.on("update_vote", ({ roomId, vote }) => {
        if (rooms[roomId] && rooms[roomId].users[socket.id]) {
            rooms[roomId].users[socket.id].vote = vote; // Update vote for the user
            io.to(roomId).emit("room_update", rooms[roomId]); // Broadcast updated room data

            // Check if all users have voted
            const allUsersVoted = Object.values(rooms[roomId].users).every(user => user.vote !== "-");
            if (allUsersVoted) {
                rooms[roomId].state = 'waiting';
                io.to(roomId).emit("room_update", rooms[roomId]);
            }
        }
    });

    socket.on("disconnect", () => {
        for (const roomId in rooms) {
            if (rooms[roomId].users[socket.id]) {
                delete rooms[roomId].users[socket.id];

                if (rooms[roomId].owner === socket.id) {
                    console.log(`Owner (${socket.id}) disconnected from room ${roomId}`);
                    const remainingUsers = Object.keys(rooms[roomId].users);
                    rooms[roomId].owner = remainingUsers.length ? remainingUsers[Math.floor(Math.random() * remainingUsers.length)] : "";
                    console.log(`New owner of room ${roomId} is ${rooms[roomId].owner}`);
                }

                io.to(roomId).emit("room_update", rooms[roomId]);
                if (!Object.keys(rooms[roomId].users).length) delete rooms[roomId];
            }
        }
    });

    // Automatically end the voting phase when the timer reaches zero
    socket.on("end_voting", ({ roomId }) => {
        if (rooms[roomId]) {
            rooms[roomId].state = 'waiting';
            Object.keys(rooms[roomId].users).forEach(socketId => {
                rooms[roomId].users[socketId].vote = 0;
            });
            io.to(roomId).emit("room_update", rooms[roomId]);
        }
    });
});

server.listen(API_PORT, () => {
    console.log("SERVER IS RUNNING");
});