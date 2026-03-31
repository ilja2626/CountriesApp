import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import CountryList from './features/countries/CountryList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let hasChanges = false;
    const migratedUsers = users.map((user: any) => {
      if (!user.favoriteCountries) {
        hasChanges = true;
        return { ...user, favoriteCountries: [] };
      }
      return user;
    });
    if (hasChanges) {
      localStorage.setItem('users', JSON.stringify(migratedUsers));
    }

    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (!parsedUser.favoriteCountries) {
        parsedUser.favoriteCountries = [];
      }
      setIsAuthenticated(true);
      setCurrentUser(parsedUser);
    }
    const darkMode = false; 
    setIsDarkMode(darkMode);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (!parsedUser.favoriteCountries) {
        parsedUser.favoriteCountries = [];
      }
      setCurrentUser(parsedUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode'} relative overflow-hidden`}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <CountryList onLogout={handleLogout} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegister={handleLogin} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;