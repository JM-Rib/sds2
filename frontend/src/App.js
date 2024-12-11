import { Route, Routes } from 'react-router-dom';
import Home from './views/home.js';
import Room from './views/room.js';
import { UserProvider } from './contexts/UserContext.js';
import './App.css';
import {RoomProvider} from "./contexts/RoomContext";

function App() {
    return (
        <UserProvider> {/* Wrap the entire application in the UserProvider */}
            <RoomProvider> {/* Wrap the entire application in the RoomProvider */}
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:roomid" element={<Room />} />
                </Routes>
            </div>
            </RoomProvider>
        </UserProvider>
    );
}

export default App;
