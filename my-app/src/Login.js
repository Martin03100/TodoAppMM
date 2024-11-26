import React, { useState } from 'react';
import './App.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
    const body = isRegister ? { username, email, password } : { username, password };

    console.log('Submitting to:', url);
    console.log('Request body:', body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        console.error('Network response was not ok:', response);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response data:', data);

      onLogin(data.username);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {isRegister && (
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </form>
  );
}

export default Login;
