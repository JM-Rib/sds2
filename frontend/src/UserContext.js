import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedSurname = localStorage.getItem('surname');

        if (!storedName || !storedSurname) {
            const userName = prompt("Please enter your name:");
            const userSurname = prompt("Please enter your surname:");

            if (userName && userSurname) {
                localStorage.setItem('name', userName);
                localStorage.setItem('surname', userSurname);
                setName(userName);
                setSurname(userSurname);
            }
        } else {
            setName(storedName);
            setSurname(storedSurname);
        }
    }, []);

    return (
        <UserContext.Provider value={{ name, surname }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
