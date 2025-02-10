import React from 'react';
import CourseItem from '../Components/Course/Course';
import data_course from '../Components/Assets/all_course';
import './CSS/Main.css';
import { useNavigate } from 'react-router-dom';

const Main = ({ accountState }) => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    if (accountState === "unregistered") {
      alert("Please login to access course content");
      // navigate('/login');
      navigate('/');
      return;
    }
  };

  return (
    <div className='main'>
      <h1>ALL COURSES</h1>
      <hr />
      <div className="course-container">
        {data_course.map((course, i) => (
          <div onClick={handleCourseClick} key={i}>
          <CourseItem
            key={i}
            course_id={course.course_id}
            course_name={course.course_name}
            image={course.image}
            price={course.price}
            subject={course.subject}
            course_length={course.course_length}
            course_type={course.course_type}
          />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;