import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataLoad() {
    const backendAdress = 'http://localhost:3300/';

    const [receivedText, setReceivedText] = useState(null);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await axios.get(backendAdress);
                setReceivedText(response.data.message); 
            } catch (error) {
                console.error("Error fetching data:", error);
                setReceivedText("Failed to load data."); 
            }
        };
        
        fetchData(); 
    }, []);

    return (
        <div className="data">
            <p>Data sent by the backend:</p>
            {
                receivedText !== null ?
                    receivedText
                        :
                    "loading ..."
            }
        </div>
    );
}

export default DataLoad;
