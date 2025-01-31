import React from 'react';
import Course from '../Components/Course/Course';
import data_course from '../Components/Assets/all_course';
import './CSS/Main.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Main = ({ accountState }) => {
  const navigate = useNavigate();

  // Redirect if the user is unregistered
  useEffect(() => {
    if (accountState === "unregistered") {
      navigate('/login'); // Redirect to login page
    }
  }, [accountState, navigate]);

  return (
    <div className='main'>
      <h1>ALL COURSES</h1>
      <hr />
      <div className="course-container">
        {data_course.map((course, i) => (
          <Course
            key={i}
            course_id={course.course_id}
            course_name={course.course_name}
            image={course.image}
            price={course.price}
            subject={course.subject}
            course_length={course.course_length}
            course_type={course.course_type}
          />
        ))}
      </div>
    </div>
  );
};

export default Main;