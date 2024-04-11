import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import icon from '../../assets/icon.png';
import { MainNav } from '../components/layout/main-nav';
import './App.css';
import AppProvider from './providers/app';

const Hello = () => {
  return (
    <div className="text-center">
      <img src={icon} alt="logo" className="h-48 w-48 mx-auto" />
      <h1 className="text-8xl font-bold">
        electron-react-boilerplate with tailwind
      </h1>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNav />
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
