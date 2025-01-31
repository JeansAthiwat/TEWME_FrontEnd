import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Login.css';

const Login = ({ onLogin, accountState }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for redirecting after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onLogin(email, password); // Call the function from App.jsx
      if (accountState !== "unregistered"){
        navigate('/'); // Redirect to Main route after login
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className='login'>
      <div className="login-container">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-fields">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-remember">
            <div className="login-remember-left">
              <input type="checkbox" />
              <p>Remember for 30 days</p>
            </div>
            <div className="login-remember-right">
              <Link to='/resetpassword' style={{ textDecoration: 'none' }} className='link'>
                Forget password?<hr />
              </Link>
            </div>
          </div>
          <button type="submit">Sign in</button>
        </form>
        <p className="login-signup">
          Don't have an account?
          <Link to='/signup' style={{ textDecoration: 'none' }} className='link'>Sign Up<hr /></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
