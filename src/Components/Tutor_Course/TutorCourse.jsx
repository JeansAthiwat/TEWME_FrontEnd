import React from 'react';
import CourseItem from '../Course/Course'; // Importing the generic CourseItem
import './TutorCourse.css';

const TutorCourse = (props) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      props.onDelete(props.course_id);
    }
  };

  return (
    <div className='course-item'>
      <CourseItem {...props} /> {}
      <button onClick={handleDelete} className='delete-btn'>Delete Course</button>
    </div>
  );
};

export default TutorCourse;