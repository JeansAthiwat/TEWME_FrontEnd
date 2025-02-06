import React from 'react';
import { Link } from 'react-router-dom';
import './TutorCourse.css';

const TutorCourse = (props) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      props.onDelete(props.course_id);
    }
  };

  return (
    <div className='course-item'>
      <div className="course-head">
        <Link to={`/course/${props.course_id}`}>
          <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt="Course" />
        </Link>
      </div>
      <Link to={`/course/${props.course_id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="course-detail">
          <p className="course-name">
            {props.course_name}
          </p>
          <div className="course-detail-price">
            <p>Price :</p>
            ${props.price}
          </div>
          <div className="course-detail-subject">
            <p>Subject :</p>
            {props.subject}
          </div>
          <div className="course-detail-length">
            <p>Course length :</p>
            {props.course_length}
          </div>
          <div className="course-detail-course_type">
            <p>Course type :</p>
            {props.course_type}
          </div>
        </div>
      </Link>
      <button onClick={handleDelete}>Delete Course</button>
    </div>
  );
};

export default TutorCourse;
