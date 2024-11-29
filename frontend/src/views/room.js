import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from "react";
import { Button } from 'primereact/button';                             
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { AvatarGroup } from 'primereact/avatargroup';   

import UserIcon from '../components/UserIcon';

        
const Room = () => {
    const [messages, setMessages] = useState(new Array(0).fill(""))
    const [message, setMessage] = useState('')
    const [messageReceived, setMessageReceived] = useState('');
    const socketRef = useRef(null);

    const userInfo = [
        {
            name: "JM",
            vote: 13 
        },
        {
            name: "A",
            vote: 3
        },
        {
            name: "G",
            vote: 5
        },
        {
            name: "H",
            vote: 1
        },
        {
            name: "D",
            vote: 2
        },
        {
            name: "K",
            vote: 21
        },
        {
            name: "T",
            vote: 8
        }
    ]

    return (
        <div className="main-content">
            <div className="flex gap-14">
                {userInfo.map( (user) => (
                    <UserIcon vote={user.vote} name={user.name} />
                ))}
            </div>
        </div>
    );
}

export default Room;

