import React from 'react'
import './CSS/Myprofile.css'



const Myprofile = () => {
  const user = {
    name: 'John Doe',
    profilePicture: 'https://via.placeholder.com/150',
    bio: 'Experienced tutor with a passion for teaching Mathematics and Science.',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    email: 'john.doe@example.com',
    phone: '+1234567890',
  };
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
          className="profile-picture"
        />
        <h1>{user.name}</h1>
        <p className="profile-bio">{user.bio}</p>
      </div>

      <div className="profile-details">
        <h2>Subjects I Can Tutor:</h2>
        <ul className="subjects-list">
          {user.subjects.map((subject, index) => (
            <li key={index}>{subject}</li>
          ))}
        </ul>
      </div>

      <div className="profile-contact">
        <h2>Contact Information</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
      </div>
    </div>
  );
};

export default Myprofile
