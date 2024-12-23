import { useState, useRef } from "react";
import './home.css';
import { useNavigate } from "react-router-dom";
import JoinRoomModal from "../components/JoinRoomModal"; // Import the modal

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:5000";

const Home = () => {
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const socketRef = useRef(null);
    const navigate = useNavigate();

    const createRoom = async () => {
        try {
            const response = await fetch(`${API_URL}/new-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message);
            }
            console.log('Room created:', data);

            if (data && data.roomId) {
                navigate(`/room/${data.roomId}`);
            } else {
                setMessage('Error: Invalid room ID');
            }
        } catch (error) {
            console.error('Error creating room:', error);
            setMessage(error.message);
        }
    };

    const joinRoom = (roomId) => {
        if (roomId) {
            navigate(`/room/${roomId}`);
        } else {
            setMessage('Error: Room ID cannot be empty');
        }
    };

    const handleJoinRoomClick = () => {
        setIsModalOpen(true); // Open the modal when "Join Room" is clicked
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
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
                <div className="square top-right"></div>
                <div className="square bottom-left"></div>
            </div>
            <h1 className="title">Planning Poker</h1>
            <div className="button-container">
                <button className="create-room-button" onClick={createRoom}>Create Room</button>
                <button className="join-room-button" onClick={handleJoinRoomClick}>Join Room</button>
            </div>
            {message && <p className="error-message">{message}</p>}

            {/* Render the JoinRoomModal when it's open */}
            <JoinRoomModal
                show={isModalOpen}
                onClose={handleCloseModal}
                onJoinRoom={joinRoom}
            />
        </div>
    );
}

export default Home;
