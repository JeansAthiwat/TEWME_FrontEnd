import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/Mycourse.css";
import TutorCourse from "../Components/Tutor_Course/TutorCourse.jsx";

const Mycourse = () => {
  const [courses, setCourses] = useState([]);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:39189/course"); // Adjust URL as needed
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Function to delete a course
  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:39189/course/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete course");

      // Remove the deleted course from state
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="Mycourse">
      <h1>YOUR COURSES</h1>
      <hr />
      <div>
        <Link to="/createcourse">
          <button className="CreateCourse-button decorated-button">
            Create Course
          </button>
        </Link>
      </div>
      <div className="course-container">
        {courses.map((course) => (
          <TutorCourse
            key={course._id}
            course_id={course._id}
            course_name={course.course_name}
            image={course.image || "default-image-url.jpg"} // Handle missing images
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
