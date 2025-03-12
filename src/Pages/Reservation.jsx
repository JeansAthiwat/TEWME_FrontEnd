import React, { useState, useEffect } from 'react'
import "./CSS/Reservation.css";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h1>My Course Reservations</h1>
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
            <span className="status-badge">{reservation.course.subject}</span>
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
              <span className="label">Reservation Date</span>
              <span className="value">{new Date(reservation.createAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Reservation