import React, { useState, useEffect } from 'react';
import './CSS/Myprofile.css';

const Myprofile = () => {
  // 🔹 State for user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Fetch User Profile on Component Mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('http://localhost:39189/api/profile/get-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Failed to fetch profile');

        setUser(data); // 🔹 Store the user data in state
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
      }
    };

    getUserProfile();
  }, []); // 🔹 Runs once when the component mounts

  // 🔹 Show loading state
  if (loading) {
    return <div className="profile-container"><h2>Loading profile...</h2></div>;
  }

  // 🔹 Show error message if fetch fails
  if (error) {
    return <div className="profile-container"><h2>Error: {error}</h2></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'} // Default image if none provided
          alt={`${user.name}'s profile`}
          className="profile-picture"
        />
        <h1>{user.firstname} {user.lastname}</h1>
        <p className="profile-bio">{user.bio || 'No bio available'}</p>
      </div>

      <div className="profile-details">
        <h2>Subjects I Can Tutor:</h2>
        <ul className="subjects-list">
          {user.subjects && user.subjects.length > 0 ? (
            user.subjects.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))
          ) : (
            <p>No subjects listed.</p>
          )}
        </ul>
      </div>

      <div className="profile-contact">
        <h2>Contact Information</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone || 'Not provided'}</p>
      </div>
    </div>
  );
};

export default Myprofile;
