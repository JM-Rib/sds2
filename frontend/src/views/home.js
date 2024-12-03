import { io } from 'socket.io-client';
import {useEffect, useState, useRef, useContext} from "react";
import './home.css';
import UserContext from "../UserContext.js";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const [message, setMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState('');
    const socketRef = useRef(null);
    const { name, surname } = useContext(UserContext);
    const navigate = useNavigate();

    /*useEffect(() => {
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
    };*/


    const createRoom = async () => {
        try {
            const response = await fetch('http://localhost:5000/new-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname }),
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message);
            }
            console.log('Room created:', data); // Handle success as needed
            navigate(`/room/${data.token}`)
        } catch (error) {
            console.error('Error creating room:', error);
            setMessage(error.message);
        }
    };

    return (
        <div className="main-content">
            <h1 className="title">Planning Poker</h1>
            <h2 className="welcome">Welcome, {name} {surname}!</h2>
            <button className="create-room-button" onClick={createRoom}>Create Room</button>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default Home;
