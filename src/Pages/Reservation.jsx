import React, { useState, useEffect } from 'react';
import "./CSS/Reservation.css";

const getSubjectColor = (subject) => {
  const colorMap = {
    'Math': '#FF6B6B',       // Red
    'Science': '#4ECDC4',    // Teal
    'Programming': '#45B7D1', // Blue
    'Art': '#96CEB4',        // Sage Green
    'Language': '#ebd249',   // Light Yellow
    'Music': '#D4A5A5'       // Dusty Rose
  };
  return colorMap[subject] || '#666666'; // Default gray if subject not found
};

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('all'); // 'all' or 'weekly'

  useEffect(() => {
    fetchReservations(viewType);
  }, [viewType]);

  const fetchReservations = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const url = type === 'weekly' 
        ? 'http://localhost:39189/reservation/weekly'
        : 'http://localhost:39189/reservation';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view your reservations');
        }
        throw new Error('Failed to fetch reservations');
      }

      const result = await response.json();
      if (result.success) {
        setReservations(result.data);
      } else {
        throw new Error('Failed to get reservation data');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewChange = (type) => {
    setViewType(type);
  };

  const handleCheckboxChange = async (id, currentFinish) => {
    try {
      const token = localStorage.getItem('token');
      const updatedReservations = reservations.map((reservation) =>
        reservation._id === id ? { ...reservation, finish: !currentFinish } : reservation
      );
      setReservations(updatedReservations); // Update local state

      const response = await fetch(`http://localhost:39189/reservation/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ finish: !currentFinish })
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating reservation status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h1>Course Reservations</h1>
        <div className="view-controls">
          <div className="toggle-buttons">
            <button 
              className={`toggle-button ${viewType === 'all' ? 'active' : ''}`}
              onClick={() => handleViewChange('all')}
            >
              All Courses
            </button>
            <button 
              className={`toggle-button ${viewType === 'weekly' ? 'active' : ''}`}
              onClick={() => handleViewChange('weekly')}
            >
              This Week
            </button>
          </div>
          <div className="reservation-count">
            <span className="count-number">{reservations.length}</span>
            <span className="count-text">Courses</span>
          </div>
        </div>
      </div>
      {reservations.map((reservation) => (
        <div key={reservation._id} className="course-header">
          <div className="course-title-section">
            <h2>{reservation.course.course_name}</h2>
            <span 
              className="status-badge" 
              style={{ backgroundColor: getSubjectColor(reservation.course.subject) }}
            >
              {reservation.course.subject}
            </span>
          </div>
          <div className="course-details">
            <div className="detail-row">
              <span className="label">Course Type</span>
              <span className="value status-green">{reservation.course.course_type}</span>
            </div>
            <div className="detail-row">
              <span className="label">Course Length</span>
              <span className="value">{reservation.course.course_length} hours</span>
            </div>
            <div className="detail-row">
              <span className="label">Price</span>
              <span className="value">{reservation.course.price} THB</span>
            </div>
            <div className="detail-row">
              <span className="label">Location / Time</span>
              <span className="value">
                {/* {reservation.course.live_detail.location} (
                {new Date(reservation.course.live_detail.start_time).toLocaleString()}) */}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Mark as Finished</span>
              <input
                type="checkbox"
                className="large-checkbox"
                checked={reservation.finish}
                onChange={() => handleCheckboxChange(reservation._id, reservation.finish)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reservation;
