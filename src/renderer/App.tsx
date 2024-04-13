import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Config } from '../components/pages/config';
import { FindRoom } from '../components/pages/findroom';
import { Home } from '../components/pages/home';
import { OnGame } from '../components/pages/ongame';
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
