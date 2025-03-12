// Mycourse.jsx
import React, { useEffect, useState } from "react";
import "./CSS/Mycourse.css";
//import TutorCourse from "../Components/Tutor_Course/TutorCourse.jsx";
import MultiStepForm from "./MultiStepForm";
import { FaCalculator, FaFlask, FaCode, FaPaintBrush, FaLanguage, FaMusic } from 'react-icons/fa';

const Mycourse = ({email}) => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:39189/course/tutor/${email}`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
  
    fetchCourses();
  }, [email]); // Added `email` as a dependency
  

  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:39189/course/${courseId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const getSubjectColor = (subject) => {
    const colorMap = {
      'Math': '#FF6B6B',
      'Science': '#4ECDC4',
      'Programming': '#45B7D1',
      'Art': '#96CEB4',
      'Language': '#FFEEAD',
      'Music': '#D4A5A5'
    };
    return colorMap[subject] || '#666666';
  };

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'Math': <FaCalculator />,
      'Science': <FaFlask />,
      'Programming': <FaCode />,
      'Art': <FaPaintBrush />,
      'Language': <FaLanguage />,
      'Music': <FaMusic />
    };
    return iconMap[subject] || <FaCalculator />;
  };

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h1>Your Courses</h1>
        <div className="view-controls">
          <button 
            className="decorated-button"
            onClick={openModal}
          >
            Create Course
          </button>
          <div className="reservation-count">
            <span className="count-number">{courses.length}</span>
            <span className="count-text">Courses</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>X</button>
            <MultiStepForm setCourses={setCourses} email={email} onClose={closeModal} />
          </div>
        </div>
      )}

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course._id} className="course-header">
            <div className="course-title-section">
              <div className="course-image-wrapper">
                <img 
                  src={course.image || 'https://via.placeholder.com/150'} // Fallback image if none provided
                  alt={course.course_name}
                  className="course-image"
                />
              </div>
              <div className="title-badge-wrapper">
                <h2>{course.course_name}</h2>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getSubjectColor(course.subject) }}
                >
                  {course.subject}
                </span>
              </div>
            </div>
            <div className="course-details">
              <div className="detail-row">
                <span className="label">Course Type</span>
                <span className="value status-green">{course.course_type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Course Length</span>
                <span className="value">{course.course_length} hours</span>
              </div>
              <div className="detail-row">
                <span className="label">Price</span>
                <span className="value">{course.price} THB</span>
              </div>
              <div className="detail-row">
                <span className="label">Actions</span>
                <span className="value">
                  <button 
                    className="delete-btn"
                    onClick={() => deleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mycourse
