import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)

    useEffect(() => {
        const storedName = localStorage.getItem('name')
        const storedSurname = localStorage.getItem('surname')
        if (storedName && storedSurname) {
            setName(storedName)
            setSurname(storedSurname)
        }
    }, []);

    return (
        <UserContext.Provider value={{ name, surname, setName, setSurname }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
