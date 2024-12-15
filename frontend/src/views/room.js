import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import UserIcon from "../components/UserIcon";
import VoteSelect from "../components/VoteSelect";
import DisplayPrompt from "../components/DisplayPrompt";
import "./room.css";

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:5000";

const Room = () => {
    const socketRef = useRef(null);
    const [userData, setUserData] = useState({}); // Room-specific user data
    const [currentUser, setCurrentUser] = useState(""); // Current user's display name
    const [showPrompt, setShowPrompt] = useState(true); // Modal visibility
    const [inputName, setInputName] = useState(""); // Input for display name
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [showInviteModal, setShowInviteModal] = useState(false); // State for the invite modal
    const { roomid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Establish WebSocket connection
        socketRef.current = io(API_URL);

        // Listen for room updates
        socketRef.current.on("room_update", (updatedRoomData) => {
            setUserData(updatedRoomData); // Update room-specific user data
        });

        // Listen for room errors (e.g., room doesn't exist)
        socketRef.current.on("room_error", (error) => {
            setErrorMessage(error.message); // Display error message if room doesn't exist
            setShowPrompt(false); // Hide display name prompt
        });

        return () => {
            socketRef.current.disconnect(); // Clean up connection on unmount
        };
    }, [navigate]);

    const handleJoinRoom = () => {
        if (inputName.trim()) {
            setCurrentUser(inputName.trim());
            setShowPrompt(false);

            // Emit join_room event
            socketRef.current.emit("join_room", {
                roomId: roomid,
                displayName: inputName.trim(),
            });
        } else {
            alert("Please enter a valid name!");
        }
    };

    const handleVote = (newVote) => {
        if (socketRef.current) {
            // Emit vote update to the server
            socketRef.current.emit("update_vote", {
                roomId: roomid,
                vote: newVote,
            });
        }
    };

    const handleGoHome = () => {
        navigate("/"); // Navigate back to home page
    };

    const handleInviteClick = () => {
        setShowInviteModal(true); // Show the invite modal when the button is clicked
    };

    const handleCopyLink = () => {
        const roomUrl = window.location.href; // Get the current URL of the room
        navigator.clipboard.writeText(roomUrl); // Copy the URL to clipboard
        setShowInviteModal(false); // Close the invite modal
    };

    const handleCloseInviteModal = () => {
        setShowInviteModal(false); // Close the invite modal when the "X" is clicked
    };

    return (
        <div className="main-content">
            {/* Error message if room doesn't exist */}
            {errorMessage && (
                <div>
                    <p className="error-message">{errorMessage}</p>
                    <button className="create-room-button" onClick={handleGoHome}>
                        Go Back to Home
                    </button>
                </div>
            )}

            {/* Invite Players button */}
            <button
                className="invite-button"
                onClick={handleInviteClick}
                style={{ position: "absolute", top: 20, right: 20 }}
            >
                Invite Players
            </button>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="invite-modal">
                    <div className="invite-modal-content">
                        <button
                            className="close-button"
                            onClick={handleCloseInviteModal}
                            style={{ position: "absolute", top: 10, right: 10 }}
                        >
                            X
                        </button>
                        <label>Invite Players:</label>
                        <input
                            type="text"
                            value={window.location.href}
                            readOnly
                            className="invite-url-input"
                        />
                        <button className="copy-link-button" onClick={handleCopyLink}>
                            Copy Link
                        </button>
                    </div>
                </div>
            )}

            {/* Modal to enter display name */}
            {!errorMessage && showPrompt && (
                <DisplayPrompt
                    inputName={inputName}
                    setInputName={setInputName}
                    handleJoinRoom={handleJoinRoom}
                />
            )}

            {/* Main room content */}
            {!showPrompt && !errorMessage && (
                <>
                    <div className="grid grid-cols-5 gap-14 mb-40">
                        {Object.entries(userData).map(([socketId, { displayName, vote }]) => (
                            <UserIcon key={socketId} vote={vote} name={displayName.substring(0,2)} />
                        ))}
                    </div>
                    <div className="mb-10">
                        {userData[socketRef.current.id]?.vote === 0
                            ? "You have not voted yet"
                            : `You voted ${userData[socketRef.current.id]?.vote}`}
                    </div>
                    <VoteSelect setVote={handleVote} />
                </>
            )}
        </div>
    );
};

export default Room;
