import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Signup.css';
// import ImageUpload from '../Components/ImageUpload/ImageUpload';

const Signup = () => {
  const navigate = useNavigate();
  const [UserType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    display_name: '',
    bank_account: '',
    birthdate: '',
    contact_info: '',
  });
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!UserType) {
      alert("Please select whether you're signing up as a tutor or learner");
      return;
    }

    if (!agree) {
      alert("You must agree to the terms of use & privacy policy.");
      return;
    }

    try {
      const response = await fetch('http://localhost:39189/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: UserType === 'Tutor' ? 'tutor' : 'learner',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      alert('Signup successful! Redirecting to login...');
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='signup'>
      <div className="signup-container">
        <h1>Sign Up</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="signup-select">
          <button 
            onClick={() => setUserType("Tutor")} 
            type='button' 
            className={`button-state ${UserType === "Tutor" ? "active" : ""}`}>
            As a Tutor
          </button>
          <button 
            onClick={() => setUserType("Learner")} 
            type='button' 
            className={`button-state ${UserType === "Learner" ? "active" : ""}`}>
            As a Learner
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="signup-fields">
            <input type="text" name="firstname" placeholder='First Name' value={formData.firstname} onChange={handleChange} required />
            <input type="text" name="lastname" placeholder='Last Name' value={formData.lastname} onChange={handleChange} required />
            <input type="text" name="display_name" placeholder='Display Name' value={formData.display_name} onChange={handleChange} required />
            <input type="email" name="email" placeholder='Email Address' value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
            <input type="date" name="birthdate" placeholder='Birthdate' value={formData.birthdate} onChange={handleChange}  max={new Date().toISOString().split("T")[0]} required />
            <input type="text" name="contact_info" placeholder='Contact Info' value={formData.contact_info} onChange={handleChange} required />
          </div>

          <div className="signup-agree">
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>

          <button type='submit'>Sign Up</button>
        </form>

        <p className="signup-login">
          Already have an account?
          <Link to='/login' style={{ textDecoration: 'none' }} className='link'>Sign in<hr/></Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
