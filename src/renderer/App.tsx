import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { App as Rik } from '../app/App';
import { Onboard } from '../app/Onboard';
import { TerminalPage } from '../app/pages/terminal';
import { ThemeProvider } from '../components/provider/theme-provider';
import { TooltipProvider } from '../components/ui/tooltip';
import './App.css';
import AppProvider from './providers/app';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Onboard />} />
              <Route path="/game/twith/on-game" element={<TerminalPage />} />
              <Route path="/game/rik/app" element={<Rik />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
