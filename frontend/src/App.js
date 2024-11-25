import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './views/home.js';
import './App.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={<Home/>}
                />
            </Routes>
        </div>
    );
}

export default App;
