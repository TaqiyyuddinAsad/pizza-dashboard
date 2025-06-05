import React, { useState } from 'react';
import '../styles/LoginPage.css';
import pizzaIcon from '../assets/pizzaicon.png';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert('Bitte Email und Passwort eingeben.');
      return;
    }
    console.log('Login:', form);
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
              name="email"
              placeholder="Benutzername"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Passwort"
              value={form.password}
              onChange={handleChange}
            />
            <button type="submit">Log In</button>
          </form>
          <p className="forgot">Passwort vergessen?</p>
        </div>
      </div>

      {/* RIGHT: LOGO */}
      <div className="login-right">
        <div className='title'>
        <img src={pizzaIcon} id= "pizza" alt="Pizza" />
        <h1>PIZZA EXPRESS</h1></div>
      </div>
    </div>
  );
};

export default LoginPage;
