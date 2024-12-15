import { Route, Routes } from 'react-router-dom';
import Home from './views/home.js';
import Room from './views/room.js';
import './App.css';

function App() {
    return (
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:roomid" element={<Room />} />
                </Routes>
            </div>
    );
}

export default App;
