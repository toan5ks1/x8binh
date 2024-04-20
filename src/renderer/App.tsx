import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { App as Game } from '../app/App';
import { Onboard } from '../app/Onboard';
import { ThemeProvider } from '../components/provider/theme-provider';
import { Toaster } from '../components/toast/toaster';
import { TooltipProvider } from '../components/ui/tooltip';
import { AccountProvider } from '../context/AccountContext';
import './App.css';
import AppProvider from './providers/app';

export default function App() {
  return (
    <AppProvider>
      <AccountProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Onboard />} />
                <Route path="/app" element={<Game />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </ThemeProvider>
      </AccountProvider>
    </AppProvider>
  );
}
