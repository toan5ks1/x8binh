import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Config } from '../games/twith/pages/config';
import { FindRoom } from '../games/twith/pages/findroom';
import { OnGame } from '../games/twith/pages/ongame';

import { ThemeProvider } from '../components/provider/theme-provider';
import { TooltipProvider } from '../components/ui/tooltip';
import { App as Rik } from '../games/rik/pages/app';
import './App.css';
import { Onboard } from './Onboard';
import AppProvider from './providers/app';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Onboard />} />
              // Twith
              <Route path="/game/twith/config" element={<Config />} />
              <Route path="/game/twith/find-room" element={<FindRoom />} />
              <Route path="/game/twith/on-game" element={<OnGame />} />
              // Rik
              <Route path="/game/rik/app" element={<Rik />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
