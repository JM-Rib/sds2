import { io } from 'socket.io-client';
import {useEffect, useState, useRef, useContext} from "react";
import './home.css';
import UserContext from "../contexts/UserContext.js";
import RoomContext from "../contexts/RoomContext";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const [message, setMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState('');
    const socketRef = useRef(null);
    const { name, surname, setName, setSurname } = useContext(UserContext);
    const { roomID, setRoomID } = useContext(RoomContext);
    const navigate = useNavigate();

    const onClickCreate = () => {
        const storedName = localStorage.getItem('name')
        const storedSurname = localStorage.getItem('surname')
        if (storedName && storedSurname) {
            setName(storedName)
            setSurname(storedSurname)
        }
        else {
            const userName = prompt("Please enter your name:")
            const userSurname = prompt("Please enter your surname:")

            if (userName && userSurname) {
                localStorage.setItem('name', userName)
                localStorage.setItem('surname', userSurname)
                setName(userName)
                setSurname(userSurname)
            }
            else {
                setMessage('Error')
            }
        }
        createRoom()
    }

    const onClickJoin = () => {
        const storedName = localStorage.getItem('name')
        const storedSurname = localStorage.getItem('surname')
        let storedRoom = localStorage.getItem('roomID')
        if (storedName && storedSurname && storedRoom) {
            setName(storedName)
            setSurname(storedSurname)
            setRoomID(storedRoom)
        }
        else {
            const userName = prompt("Please enter your name:")
            const userSurname = prompt("Please enter your surname:")
            const userRoom = prompt("Please enter the room ID:")

            if (userName && userSurname && userRoom) {
                localStorage.setItem('name', userName)
                localStorage.setItem('surname', userSurname)
                localStorage.setItem('roomID', userRoom)
                setName(userName)
                setSurname(userSurname)
                setRoomID(userRoom)
                storedRoom = userRoom
            }
            else {
                setMessage('Error')
            }
        }
        joinRoom(storedRoom)
    }

    const joinRoom = async (token) => {
        try {
            const response = await fetch(`http://localhost:5000/room/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Room validated:', data);
                navigate(`/room/${token}`);
            } else {
                console.error('Error joining room:', data.message);
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error joining room:', error);
            setMessage('Something went wrong while validating the room.');
        }
    };

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
            <div className="animated-background">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                {/* Add the new squares */}
                <div className="square top-right"></div>
                <div className="square bottom-left"></div>
            </div>
            <h1 className="title">Planning Poker</h1>
            <h2 className="welcome">Welcome, {name} {surname}!</h2>
            <button className="create-room-button" onClick={onClickCreate}>Create Room</button>
            <button className="join-room-button" onClick={onClickJoin}>Join Room</button>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default Home;
