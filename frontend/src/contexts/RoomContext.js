import React, { createContext, useState, useEffect } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [roomID, setRoomID] = useState(null)
    const [members, setMembers] = useState([])

    useEffect(() => {
        const storedRoomID = localStorage.getItem('roomID')
        if (storedRoomID) {
            setRoomID(storedRoomID)
        }
    }, []);

    return (
        <RoomContext.Provider value={{ roomID, setRoomID, members, setMembers }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomContext;
