import React, { useEffect, useState } from "react";
import "./CSS/Mycourse.css";
import MultiStepForm from "./MultiStepForm";
import { FaCalculator, FaFlask, FaCode, FaPaintBrush, FaLanguage, FaMusic, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import defaultCourseIcon from "../Components/Assets/book.avif"

const Mycourse = ({ UID, email }) => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:39189/course/tutor/${UID}`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
        // console.log(data)
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
  
    fetchCourses();
    
  }, [UID, email]); // Added `tutor_id` as a dependency
  

  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:39189/course/${courseId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
          "Content-Type": "application/json"
        }
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
      'Math': '#3b82f6',      // Blue
      'Science': '#10b981',   // Green
      'Programming': '#6366f1', // Indigo
      'Art': '#ec4899',       // Pink
      'Language': '#f59e0b',  // Amber
      'Music': '#8b5cf6'      // Purple
    };
    return colorMap[subject] || '#64748b'; // Default gray
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
    <div className="mycourse-container">
      <div className="mycourse-header">
        <h1>Your Courses</h1>
        <div className="mycourse-view-controls">
          <button className="decorated-button" onClick={openModal}>
            Create Course
          </button>
          <div className="mycourse-count">
            <span className="mycourse-count-number">{courses.length}</span>
            <span className="mycourse-count-text">Courses</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1000 }}>
          <div className="modal-content relative" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1001 }}>
            <button 
              className="close-button absolute top-2 right-2 text-gray-700 hover:text-gray-900 transition duration-200"
              onClick={closeModal}
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <MultiStepForm setCourses={setCourses} tutorID={UID} tEmail={email} onClose={closeModal} />
          </div>
        </div>
      )}

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course._id} className="mycourse-card">
            <div className="delete-btn-wrapper">
              <button 
                className="delete-btn"
                onClick={() => deleteCourse(course._id)}
              >
                Delete
              </button>
            </div>
            <div className="mycourse-title-section">
              <div className="mycourse-image-wrapper">        
                <Link to={`/course/${course.id}`}>
                <img 
                  src={course.image || defaultCourseIcon} // Fallback image if none provided
                  alt={course.course_name}
                  className="mycourse-image"
                />
                </Link>

              </div>
              <div className="title-badge-wrapper">
                <h2>{course.course_name}</h2>
                <span 
                  className="mycourse-status-badge"
                  style={{ backgroundColor: getSubjectColor(course.subject) }}
                >
                  {course.subject}
                </span>
              </div>
            </div>
            <div className="mycourse-details">
              <div className="mycourse-detail-row">
                <span className="mycourse-label">Course Type</span>
                <span className="mycourse-value mycourse-status-green">{course.course_type}</span>
              </div>
              <div className="mycourse-detail-row">
                <span className="mycourse-label">Course Length</span>
                <span className="mycourse-value">{course.course_length} hours</span>
              </div>
              <div className="mycourse-detail-row">
                <span className="mycourse-label">Price</span>
                <span className="mycourse-value">{course.price} THB</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mycourse;
