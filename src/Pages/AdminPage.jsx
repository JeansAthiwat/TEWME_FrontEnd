import React, { useState , useEffect } from 'react';
import './CSS/AdminPage.css'; // We'll create this CSS file next
import { GiConsoleController } from 'react-icons/gi';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tutors, setTutors] = useState([]);
  useEffect(() => {
      const getTutors= async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No token found');
  
          const response = await fetch('http://localhost:39189/user/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
          if (!response.ok) throw new Error(data.msg || 'Failed to fetch profile');
  
          //console.log(data)
          const keysToPick = ["_id", "firstname", "lastname", "email"];
          const filteredData = data.filter(user => (user.role ===  "tutor" && !user.verification_status) ).map(obj =>
            Object.fromEntries(Object.entries(obj).filter(([key]) => keysToPick.includes(key)))
          );
          
          setTutors(filteredData);
          
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      getTutors();
      
    }, []);
  const handleVerify = async (tutor) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const response = await fetch('http://localhost:39189/admin/'+tutor.email, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


    } catch (error) {
        // console.log("df")
        setError(error.message);
    }

    setTutors((prevTutors) =>
      prevTutors.map((t) =>
        t._id === tutor._id ? { ...t, verified: true } : t
      ));
  };

  const handleReject = async (tutor) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const response = await fetch('http://localhost:39189/admin/'+tutor.email, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


    } catch (error) {
        // console.log("df")
        setError(error.message);
    }
    setTutors((prevTutors) => prevTutors.filter((t) => tutor._id !== t._id));
  };

  if (loading) {
    return <div className="profile-container"><h2>Loading tutors...</h2></div>;
  } 

  if (error) {
    return <div className="profile-container"><h2>Error: {error}</h2></div>;
  }

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
            <tr key={tutor._id}>
              <td>{tutor.firstname + " "+ tutor.lastname}</td>
              <td>{tutor.email}</td>
              <td>{tutor.verified ? 'Verified' : 'Unverified'}</td>
              <td>
                {!tutor.verified && (
                  <div className='action-buttons'>
                    <button
                      className="verify-btn"
                      onClick={() => handleVerify(tutor)}
                    >
                      Verify
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(tutor)}
                    >
                      Reject
                    </button>
                  </div>
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