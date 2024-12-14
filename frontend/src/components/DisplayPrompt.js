import React from "react";

const DisplayPrompt = ({ inputName, setInputName, handleJoinRoom }) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.heading}>Join the Fun!</h2>
                <p style={styles.subheading}>Enter your display name to start</p>
                <input
                    type="text"
                    placeholder="Your display name"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleJoinRoom} style={styles.button}>
                    Join Room
                </button>
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
        fontSize: "3rem",
        color: "#333",
        marginBottom: "15px",
    },
    subheading: {
        fontSize: "1.5rem",
        color: "#666",
        marginBottom: "25px",
    },
    input: {
        width: "100%",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "10px",
        border: "2px solid #ccc",
        fontSize: "1.2rem",
        outline: "none",
        transition: "border-color 0.3s",
    },
    inputFocus: {
        borderColor: "#007bff",
    },
    button: {
        backgroundColor: "#007bff", // Blue color for the button
        color: "white",
        padding: "12px 24px",
        borderRadius: "5px", // Rounded corners
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease", // Transition for background and transform
    },
    buttonHover: {
        backgroundColor: "#0056b3", // Darker blue for hover effect
    },
    buttonActive: {
        backgroundColor: "#003f7f", // Even darker blue for active/pressed effect
    },
};

export default DisplayPrompt;