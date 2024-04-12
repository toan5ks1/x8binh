import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
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
          <Route path="/find-room" element={<FindRoom />} />
          <Route path="/on-game" element={<OnGame />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
