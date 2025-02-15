import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = ({ setAccountState, setProfilePicture }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    console.log("✅ Token from URL:", token); // ✅ Debugging

    if (token) {
      localStorage.setItem('token', token); // ✅ Store token correctly
      console.log("✅ Token stored in localStorage:", localStorage.getItem('token'));

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
          navigate('/complete-profile');
        } else {
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
