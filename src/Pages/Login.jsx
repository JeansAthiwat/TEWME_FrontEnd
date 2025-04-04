import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/authHandlers'; // ✅ Import the correct function
import GoogleLogin from '../Components/GoogleLogin/GoogleLogin'; // ✅ Import Google Login component
import './CSS/Login.css';

const Login = ({ accountState, setAccountState , setProfilePicture, email, setEmail}) => {
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for redirecting after login

  // Handle form submission using authHandlers.js function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await handleLogin(email, password, setAccountState, setProfilePicture, setEmail) // ✅ Call centralized login function
      console.log("Logged in successfully");
      

    } catch (error) {
      setError("Login failed! Check credentials.");
    }
  };

  // Redirect when login is successful
  useEffect(() => {
    if (accountState !== "unregistered") {
      // navigate('/myprofile');
      // navigate('/myprofile')
      navigate('/')
    }
  }, [accountState, navigate]);

  return (
    <div className='login'>
      <div className="login-container">
        <h1>Sign in</h1>
        {error && <p className="error-message">{error}</p>}
        <form method="POST" onSubmit={handleSubmit}>
          <div className="login-fields">
            <input 
              type="email" 
              name="username"
              autoComplete="username"
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              name="password"
              autoComplete="current-password"
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
              <Link to='/resetpassword' className='link hover:underline'>
                Forget password?
              </Link>
            </div>
          </div>
          <button type="submit">Sign in</button>
        </form>

        {/* 🔹 Google Login Button */}
        <div className="google-login-container">
          <GoogleLogin />
        </div>

        <p className="login-signup">
          Don't have an account?
          <Link to='/signup' className='link pl-2'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
