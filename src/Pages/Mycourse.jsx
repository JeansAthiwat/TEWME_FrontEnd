import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Mycourse.css";
import data_course from "../Components/Assets/tutor_course_list.js";
import TutorCourse from "../Components/Tutor_Course/TutorCourse.jsx";

const Mycourse = () => {
  // Use state to manage the list of courses
  const [courses, setCourses] = React.useState(data_course);

  // Function to delete a course by its course_id
  const deleteCourse = (courseId) => {
    setCourses(courses.filter(course => course.course_id !== courseId));
  };

  return (
    <div className="Mycourse">
      <h1>Your Courses</h1>
      <div>
        <Link to="/createcourse">
          <button className="CreateCourse-button">
            Create Course.
          </button>
        </Link>
      </div>
      <hr />
      <div className="course-container">
        {courses.map(course => (
          <TutorCourse
            key={course.course_id}
            course_id={course.course_id}
            course_name={course.course_name}
            image={course.image}
            price={course.price}
            subject={course.subject}
            course_length={course.course_length}
            course_type={course.course_type}
            onDelete={deleteCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default Mycourse;
