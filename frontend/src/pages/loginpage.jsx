import React, { useState } from 'react';
import '../styles/LoginPage.css';
import pizzaIcon from '../assets/pizzaicon.png';
import TextPressure from "../components/textpressure.jsx";

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
              type="email"
              name="email"
              placeholder="E-Mail"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Passwort"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Log In</button>
          </form>
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
