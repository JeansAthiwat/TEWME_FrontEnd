import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/authHandlers'; // ✅ Import the correct function
import './CSS/Login.css';

const Login = ({ accountState, setAccountState }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for redirecting after login

  // Handle form submission using authHandlers.js function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await handleLogin(email, password, setAccountState); // ✅ Call centralized login function
      console.log("Logged in successfully");

      // Redirect after login
      navigate('/');
    } catch (error) {
      setError("Login failed! Check credentials.");
    }
  };

  // Redirect when login is successful
  useEffect(() => {
    if (accountState !== "unregistered") {
      navigate('/');
    }
  }, [accountState, navigate]);

  return (
    <div className='login'>
      <div className="login-container">
        <h1>Sign in</h1>
        {error && <p className="error-message">{error}</p>}
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
