import { io } from 'socket.io-client';
import React, { useEffect, useState, useRef, useContext } from "react"; // Ensure React and useContext are imported
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { AvatarGroup } from 'primereact/avatargroup';

import UserIcon from '../components/UserIcon';
import VoteSelect from '../components/VoteSelect';
import UserContext from "../UserContext.js";
import {useNavigate, useParams} from "react-router-dom";

const Room = () => {
    const [messages, setMessages] = useState(new Array(0).fill(""));
    const [message, setMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState('');
    const socketRef = useRef(null);
    const { name, surname } = useContext(UserContext);
    const { roomid } = useParams();
    const [vote, setVote] = useState(0);
    const navigate = useNavigate();
    const userInfo = [
        { name: "JM", vote: 13 },
        { name: "A", vote: 3 },
        { name: "G", vote: 5 },
        { name: "H", vote: 1 },
        { name: "D", vote: 2 },
        { name: "K", vote: 21 },
        { name: "T", vote: 8 }
    ];

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/room/${roomid}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status === 'success') {
                    // Token is valid; allow access to the room
                    console.log('Token is valid');
                } else {
                    // Handle invalid token (e.g., redirect to login or show an error message)
                    console.error('Invalid token:', data.message || 'Unknown error');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                navigate('/'); // Redirect to an error page
            }
        };

        checkToken();
    }, [navigate, roomid]); // Added roomid to the dependency array

    return (
        <div className="main-content">
            <div className="grid grid-cols-5 gap-14 mb-40">
                {userInfo.map((user, index) => (
                    <UserIcon key={index} vote={user.vote} name={user.name} />
                ))}
            </div>
            <div className="mb-10">
                {vote === 0 ? "You have not voted yet" : `You voted ${vote}`}
            </div>
            <VoteSelect setVote={setVote}></VoteSelect>
        </div>
    );
};

export default Room;
