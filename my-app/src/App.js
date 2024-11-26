import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser({ username });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />  // Prenášame user ako prop
      )}
    </div>
  );
}

export default App;
