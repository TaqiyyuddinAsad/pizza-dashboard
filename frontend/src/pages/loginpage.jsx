import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import pizzaIcon from '../assets/pizzaicon.png';
import TextPressure from "../components/textpressure.jsx";

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.username || !form.password) {
      setError('Bitte Benutzername und Passwort eingeben.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      console.log('Login response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Login response data:', data);
        localStorage.setItem('token', data.token);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));
        navigate('/umsatz');
      } else {
        const errorText = await res.text();
        console.log('Login failed with status:', res.status, 'Error:', errorText);
        setError('Login fehlgeschlagen');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Fehler beim Login');
    }
  };

  return (
    <div className="login-page">
      {/* LEFT: FORM */}
      <div className="login-left">
        <div className="form-box">
          <h2 id='login'>Log In</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Benutzername"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Passwort"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button type="submit">Log In</button>
          </form>
          {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        </div>
      </div>
      {/* RIGHT: LOGO */}
      <div className="login-right">
        <div className='title'>
          <img src={pizzaIcon} id="pizza" alt="Pizza" />
          <TextPressure
            text="PIZZA EXPRESS"
            flex={true}
            alpha={false}
            stroke={false}
            width={false}
            weight={true}
            italic={false}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
