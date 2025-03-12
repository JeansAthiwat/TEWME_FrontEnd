// Mycourse.jsx
import React, { useEffect, useState } from "react";
import "./CSS/Mycourse.css";
import TutorCourse from "../Components/Tutor_Course/TutorCourse.jsx";
import MultiStepForm from "./MultiStepForm";

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

  return (
    <div className="Mycourse">
      <h1>YOUR COURSES</h1>
      <hr />
      <div>
        <button
          className="CreateCourse-button decorated-button"
          onClick={openModal}
        >
          Create Course
        </button>
      </div>

      {showModal && (
  <div className="modal-overlay" onClick={closeModal}>
    <div
      className="modal-content w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <button className="close-button" onClick={closeModal}>
        X
      </button>
      <MultiStepForm setCourses={setCourses} email={email} onClose={closeModal} />
    </div>
  </div>
)}

      {/* {console.log(email)} */}
      <div className="course-container">
        {/* {console.dir(courses.filter((course)=> course.t_email===email))} */}
        {courses.map((course) => (
          <TutorCourse
            key={course._id}
            t_email={course.t_email}
            course_id={course._id}
            course_name={course.course_name}
            image={course.image || "default-image-url.jpg"}
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
