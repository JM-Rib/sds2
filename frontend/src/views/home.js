import { io } from 'socket.io-client';
import {useEffect, useState, useRef, useContext} from "react";
import './home.css';
import UserContext from "../UserContext.js";

const Home = () => {
    const [message, setMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState('');
    const socketRef = useRef(null);
    const { name, surname } = useContext(UserContext);

    useEffect(() => {
        const url = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:5000";
        socketRef.current = io.connect(url);

        socketRef.current.emit("join_room", "room_name");

        socketRef.current.on("receive_message", (data) => {
            setMessageReceived(data.message);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (socketRef.current) {
            socketRef.current.emit("send_message", { message, room: "room_name" });
        }
    };

    return (
        <div className="main-content">
            <h1 className="title">Planning Poker</h1>
            <h2 className="welcome">Welcome, {name} {surname}!</h2>
            <button className="create-room-button">Join Room</button>
        </div>
    );
}

export default Home;
