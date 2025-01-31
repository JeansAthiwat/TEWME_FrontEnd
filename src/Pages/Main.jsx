import React from 'react'
import Course from '../Components/Course/Course'
import data_course from '../Components/Assets/all_course'
import './CSS/Main.css'

const Main = () => {
  return (
    <div className='main'>
        <h1>ALL COURSES</h1>
        <hr />
          <div className="course">
            {data_course.map((course,i)=>{
                return <Course key={i} course_id={course.course_id} course_name={course.course_name} image={course.image} price={course.price} subject={course.subject} course_length={course.course_length} course_type={course.course_type}/>
            })}
          </div>
    </div>
  )
}

export default Main
