import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import UserIcon from "../components/UserIcon";
import VoteSelect from "../components/VoteSelect";
import DisplayPrompt from "../components/DisplayPrompt";
import WaitingRoundStart from "../components/WaitingRoundStart";
import "./room.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Room = () => {
    const socketRef = useRef(null);
    const [userData, setUserData] = useState({});
    const [currentUser, setCurrentUser] = useState("");
    const [showPrompt, setShowPrompt] = useState(true);
    const [inputName, setInputName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [owner, setOwner] = useState("");
    const [roomState, setRoomState] = useState("waiting");
    const [timer, setTimer] = useState(60);
    const { roomid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        socketRef.current = io(API_URL);

        socketRef.current.on("room_update", ({ users, owner, state }) => {
            setUserData(users);
            setOwner(owner);
            setRoomState(state);
            if (state === "waiting") setTimer(60);
        });

        socketRef.current.on("room_error", ({ message }) => {
            setErrorMessage(message);
            setShowPrompt(false);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [navigate]);

    useEffect(() => {
        if (roomState === "voting") {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        socketRef.current.emit("end_voting", { roomId: roomid });
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [roomState]);

    const handleJoinRoom = () => {
        if (inputName.trim()) {
            setCurrentUser(inputName.trim());
            setShowPrompt(false);

            socketRef.current.emit("join_room", {
                roomId: roomid,
                displayName: inputName.trim(),
            });
        } else {
            alert("Please enter a valid name!");
        }
    };

    const handleVote = (newVote) => {
        if (roomState === "voting" && socketRef.current) {
            socketRef.current.emit("update_vote", {
                roomId: roomid,
                vote: newVote,
            });
        }
    };

    const handleGoHome = () => {
        navigate("/");
    };

    const handleInviteClick = () => {
        setShowInviteModal(true);
    };

    const handleCopyLink = () => {
        const roomUrl = window.location.href;
        navigator.clipboard.writeText(roomUrl);
        setShowInviteModal(false);
    };

    const handleCloseInviteModal = () => {
        setShowInviteModal(false);
    };

    const handleStartRound = () => {
        if (socketRef.current) {
            socketRef.current.emit("start_round", { roomId: roomid });
            setTimer(60);
        }
    };

    const handleReconnect = () => {
        window.location.reload();
    };

    const allUsersVoted = Object.values(userData).every((user) => user.vote !== 0);

    return (
        <div className="main-content">
            {(errorMessage || (roomState === "voting" && !currentUser)) && (
                <div className="error-container">
                    <p className="error-message">
                        {errorMessage || "Voting is currently in progress. You cannot join the room at this time."}
                    </p>
                    <button
                        className="error-button"
                        onClick={errorMessage ? handleGoHome : handleReconnect}
                    >
                        {errorMessage ? "Go Back to Home" : "Try Again"}
                    </button>
                </div>
            )}

            <button
                className="invite-button"
                onClick={handleInviteClick}
                style={{ position: "absolute", top: 20, right: 20 }}
            >
                Invite Players
            </button>

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

            <div className="timer" style={{ position: "absolute", bottom: 20, left: 20 }}>
                Time Left: {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
            </div>

            {!errorMessage && showPrompt && roomState !== "voting" && (
                <DisplayPrompt
                    inputName={inputName}
                    setInputName={setInputName}
                    handleJoinRoom={handleJoinRoom}
                />
            )}

            {!showPrompt && !errorMessage && (
                <>
                    {owner === socketRef.current.id && roomState === "waiting" && (
                        <div className="center-container">
                            <button onClick={handleStartRound} className="start-round-button">
                                Start Round
                            </button>
                        </div>
                    )}

                    {owner !== socketRef.current.id && roomState === "waiting" && (
                        <div className="center-container">
                            <WaitingRoundStart></WaitingRoundStart>
                        </div>
                    )}

                    <div className="grid grid-cols-5 gap-14 mb-40">
                        {Object.entries(userData).map(([socketId, user]) =>
                            user?.displayName ? (
                                <UserIcon
                                    key={socketId}
                                    vote={allUsersVoted || timer === 0 ? user.vote : "-"}
                                    name={user.displayName.substring(0, 2)}
                                />
                            ) : null
                        )}
                    </div>
                    {roomState === "voting" &&
                        userData[socketRef.current.id]?.vote === "-" && (
                            <VoteSelect setVote={handleVote} />
                        )}
                </>
            )}
        </div>
    );
};

export default Room;
