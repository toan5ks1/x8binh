import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AppProvider from './providers/app';
import { Home } from '../components/pages/home';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
