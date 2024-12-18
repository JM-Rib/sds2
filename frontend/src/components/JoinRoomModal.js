import React, { useState } from "react";

const JoinRoomModal = ({ show, onClose, onJoinRoom }) => {
    const [roomId, setRoomId] = useState("");

    const handleSubmit = () => {
        if (roomId) {
            onJoinRoom(roomId); // Pass the roomId back to Home component
            onClose(); // Close the modal
        } else {
            alert("Room ID cannot be empty");
        }
    };

    if (!show) return null; // Don't render the modal if `show` is false

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.heading}>Join a Room</h2>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    style={styles.input}
                />
                <div style={styles.buttonContainer}>
                    <button onClick={handleSubmit} style={styles.button}>
                        Join Room
                    </button>
                    <button onClick={onClose} style={styles.buttonCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "40px",
        textAlign: "center",
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
        width: "90%",
        maxWidth: "400px",
    },
    heading: {
        fontSize: "2rem",
        color: "#333",
        marginBottom: "20px",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "10px",
        border: "2px solid #ccc",
        fontSize: "1.2rem",
        outline: "none",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "12px 24px",
        borderRadius: "5px",
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    buttonCancel: {
        backgroundColor: "#ccc",
        width: "120px", // Make the Cancel button wider
        padding: "12px 24px",
        borderRadius: "5px",
        fontSize: "1.2rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};

export default JoinRoomModal;
