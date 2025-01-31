import React from 'react'
import { Link } from 'react-router-dom'
import './Course.css'

const Course = (props) => {
  return (
    <div className='course'>
      <div className="course-head">
        <Link to={`/course/${props.course_id}`}>
          <img onClick={window.scrollTo(0,0)} src={props.image} alt="" />
        </Link>
        <p>
          {props.course_name}
        </p>
      </div>
      <div className="course-detail">
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
      
    </div>
  )
}

export default Course
