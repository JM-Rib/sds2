import { io } from 'socket.io-client';
import React, { useEffect, useState, useRef, useContext } from "react"; // Ensure React and useContext are imported
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { AvatarGroup } from 'primereact/avatargroup';

import UserIcon from '../components/UserIcon';
import VoteSelect from '../components/VoteSelect';
import UserContext from "../UserContext.js";

const Room = () => {
    const [messages, setMessages] = useState(new Array(0).fill(""));
    const [message, setMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState('');
    const socketRef = useRef(null);
    const { name, surname } = useContext(UserContext);

    const [vote, setVote] = useState(0);

    const userInfo = [
        { name: "JM", vote: 13 },
        { name: "A", vote: 3 },
        { name: "G", vote: 5 },
        { name: "H", vote: 1 },
        { name: "D", vote: 2 },
        { name: "K", vote: 21 },
        { name: "T", vote: 8 }
    ];

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
