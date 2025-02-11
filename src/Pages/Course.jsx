import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Course = () => {
  const { courseId } = useParams()
  const [ course, setCourse ] = useState()
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const getCourse = async() => {
      const response = await fetch(`http://localhost:39189/course/${courseId}`)
      const data = await response.json()
      setCourse(data)
    }
    getCourse()
  },[])
  useEffect(()=> {
    if(course)
      setVideos(course.videos)
  },[course])
  return (
    (
      (course && videos.length) ?
      (<div className='course'>
        <div className="course-title">{course.course_name}</div>
        <ul>
          {course.videos.map((vid,index) => (
            <li key={index}>
              <Link to={`video/${index}`}><button className="video-link">{vid.video_title}</button></Link>
            </li>
          ))}
        </ul>
      </div>):
      (<h1>Loading...</h1>)
    )
  )
}

export default Course
