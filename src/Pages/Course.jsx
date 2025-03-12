import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Course = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState()
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const getCourse = async () => {
      const response = await fetch(`http://localhost:39189/course/${courseId}`)
      const data = await response.json()
      setCourse(data)
    }
    getCourse()
  }, [courseId])

  useEffect(() => {
    if (course) setVideos(course.videos)
  }, [course])

  // Handler to download the supplementary file
  const handleDownload = () => {
    window.open(`http://localhost:39189/course/${courseId}/supplementary`, '_blank')
  }
  
  return (
    
    (course) ? (
      
      <div className='course'>
        <div className="course-title">{course.course_name}</div>
        {/* Render download button only if supplementary_file exists */}
        {course.supplementary_file && (
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9V13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.9a.5.5 0 0 0-1 0V13H1.5V9.9a.5.5 0 0 0-1 0z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.854 7.646a.5.5 0 1 0-.708.708l3.5 3.5z"/>
            </svg>
            Download Supplementary Material
          </button>
        )}
        <ul>
          {course.videos && course.videos.map((vid, index) => (
            <li key={index}>
              <Link to={`video/${index}`}>
                <button className="video-link">{vid.video_title}</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (<h1>Loading...</h1>)
  )
}

export default Course
