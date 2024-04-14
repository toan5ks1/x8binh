import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Config } from '../games/twith/pages/config';
import { FindRoom } from '../games/twith/pages/findroom';
import { OnGame } from '../games/twith/pages/ongame';

import { Config as ConfigRik } from '../games/rik/pages/config';
import { FindRoom as FindRoomRik } from '../games/rik/pages/findroom';
import { OnGame as OnGameRik } from '../games/rik/pages/ongame';
import './App.css';
import { Onboard } from './Onboard';
import AppProvider from './providers/app';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboard />} />
          // Twith
          <Route path="/game/twith/config" element={<Config />} />
          <Route path="/game/twith/find-room" element={<FindRoom />} />
          <Route path="/game/twith/on-game" element={<OnGame />} />
          // Rik
          <Route path="/game/rik/config" element={<ConfigRik />} />
          <Route path="/game/rik/find-room" element={<FindRoomRik />} />
          <Route path="/game/rik/on-game" element={<OnGameRik />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
