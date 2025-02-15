import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogin } from '../utils/authHandlers';
import GoogleLogin from '../Components/GoogleLogin/GoogleLogin';

const Login = ({ accountState, setAccountState, setProfilePicture }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await handleLogin(email, password, setAccountState, setProfilePicture);
      console.log("Logged in successfully");
    } catch (error) {
      setError("Login failed! Check credentials.");
    }
  };

  useEffect(() => {
    if (accountState !== "unregistered") {
      navigate('/');
    }
  }, [accountState, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-md text-center">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Sign in</h1>
        {error && <p className="mb-4 text-red-600 transition-opacity duration-300">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-md text-base transition duration-300 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-md text-base transition duration-300 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              <span>Remember for 30 days</span>
            </label>
            <Link to="/resetpassword" className="text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-gray-800 text-white rounded-md text-lg font-semibold transition duration-300 transform hover:bg-indigo-600 hover:scale-95"
          >
            Sign in
          </button>
        </form>
        <div className="mt-6">
          <GoogleLogin />
        </div>
        <p className="mt-6 text-base text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
