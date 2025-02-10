import React, { useState } from 'react';
import './CSS/AdminPage.css'; // We'll create this CSS file next

const AdminPage = () => {
  const [tutors, setTutors] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', verified: false },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', verified: false },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', verified: false },
  ]);

  const handleVerify = (id) => {
    setTutors((prevTutors) =>
      prevTutors.map((tutor) =>
        tutor.id === id ? { ...tutor, verified: true } : tutor
      )
    );
  };

  const handleReject = (id) => {
    setTutors((prevTutors) => prevTutors.filter((tutor) => tutor.id !== id));
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard - Tutor Verification</h1>
      <table className="tutors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor) => (
            <tr key={tutor.id}>
              <td>{tutor.name}</td>
              <td>{tutor.email}</td>
              <td>{tutor.verified ? 'Verified' : 'Unverified'}</td>
              <td>
                {!tutor.verified && (
                  <>
                    <button
                      className="verify-btn"
                      onClick={() => handleVerify(tutor.id)}
                    >
                      Verify
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(tutor.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;