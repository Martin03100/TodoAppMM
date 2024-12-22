import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

function Login({ onLogin }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
    const body = isRegister ? { username, email, password } : { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User data:', data);
      onLogin(data); // Predáme celé používateľské dáta vrátane ID
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder={t('username')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {isRegister && (
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}
      <input
        type="password"
        placeholder={t('password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isRegister ? t('register') : t('login')}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? t('switch_to_login') : t('switch_to_register')}
      </button>
    </form>
  );
}

export default Login;
