import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Config } from '../games/twith/pages/config';
import { FindRoom } from '../games/twith/pages/findroom';
import { Home } from '../games/twith/pages/home';
import { OnGame } from '../games/twith/pages/ongame';
import './App.css';
import AppProvider from './providers/app';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<Config />} />
          <Route path="/find-room" element={<FindRoom />} />
          <Route path="/on-game" element={<OnGame />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
