import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './Login';
import Dashboard from './Dashboard';
import LanguageSelector from './LanguageSelector';
import './App.css';
import './i18n';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('sk');
  const { t, i18n } = useTranslation();

  const handleLogin = (userData) => {
    console.log('User data received in handleLogin:', userData);  // Pridané logovanie
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="App">
      <button className="toggle-mode" onClick={toggleDarkMode}>
        {darkMode ? t('light_mode') : t('dark_mode')}
      </button>
      <LanguageSelector setLanguage={setLanguage} />
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
