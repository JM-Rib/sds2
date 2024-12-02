import { Route, Routes } from 'react-router-dom';
import Home from './views/home.js';
import Room from './views/room.js';
import { UserProvider } from './UserContext.js';
import './App.css';

function App() {
    return (
        <UserProvider> {/* Wrap the entire application in the UserProvider */}
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:roomid" element={<Room />} />
                </Routes>
            </div>
        </UserProvider>
    );
}

export default App;
