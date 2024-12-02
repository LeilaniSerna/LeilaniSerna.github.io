import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegPage from './components/RegPage';
import NavBar from './components/NavBar';
import EditPage from './components/Edit'; 
import HomePageinvitado from './componentsInvitado/HomePageinvitado'; // Ruta correcta
import NavBarinvitado from './componentsInvitado/NavBarinvitado'; // Importa NavBarinvitado
import StatisticsPage from './components/StatisticsPage';
import StatisticsPageinvitado from './componentsInvitado/StatisticsPageinvitado';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();

  // Mostrar NavBar solo en ciertas rutas
  const showNavBar = ['/home', '/Edit', '/Statistics'].includes(location.pathname);
  const showNavBarInvitado = location.pathname === '/homeinvitado'; // Verifica si estás en la ruta homeinvitado

  return (
    <div>
      {showNavBar && <NavBar />}
      {showNavBarInvitado && <NavBarinvitado />} {/* Mostrar NavBarinvitado solo en homeinvitado */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/homeinvitado" element={<HomePageinvitado />} />  {/* Ruta para el invitado */}
        <Route path="/RegPage" element={<RegPage />} />
        <Route path="/Edit" element={<EditPage />} />
        <Route path="/Statistics" element={<StatisticsPage />} />
        <Route path="/Statisticsinvitado" element={<StatisticsPageinvitado />} />

      </Routes>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
