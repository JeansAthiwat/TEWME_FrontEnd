import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = ({ setAccountState, setProfilePicture }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const UID = urlParams.get('UID');
    const email = urlParams.get('email');

    console.log("✅ Token from URL:", token); // ✅ Debugging
    console.log("✅ UserID from URL:", UID); // ✅ Debugging
    console.log("✅ email from URL:", email); // ✅ Debugging

    if (token) {
      localStorage.setItem('token', token); // ✅ Store token correctly
      console.log("✅ Token stored in localStorage:", localStorage.getItem('token'));
      localStorage.setItem('UID', UID); // ✅ Store UID correctly
      console.log("✅ UID stored in localStorage:", localStorage.getItem('UID'));
      localStorage.setItem('email', email); // ✅ Store UID correctly
      console.log("✅ email stored in localStorage:", localStorage.getItem('email'));

      fetch('http://localhost:39189/api/profile/get-profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        console.log("✅ User profile received:", data);

        if (data.role) {
          setAccountState(data.role); // ✅ Ensure accountState updates
        } else {
          console.warn("❌ Role is missing from profile data");
        }

        setProfilePicture(data.profilePicture || '');

        if (!data.firstname || !data.lastname || !data.phone || !data.birthdate || data.role === 'google_user') {
          console.log("🔴 Incomplete profile detected, redirecting to complete-profile");
          console.log(data);
          navigate('/complete-profile');
        } else {
          console.log("✅ Profile is complete, redirecting to home");
          navigate('/');
        }
      })
      .catch(err => {
        console.error('❌ Error fetching profile:', err);
        navigate('/login');
      });
    } else {
      console.error("❌ No token found in URL");
      navigate('/login');
    }
  }, [navigate, setAccountState, setProfilePicture]);

  return <h2>Logging in...</h2>;
};

export default LoginSuccess;
