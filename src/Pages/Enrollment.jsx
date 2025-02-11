import { useState, useEffect } from 'react'
import CourseItem from '../Components/Course/Course'

const Enrollment = () => {
    const [courses, setCourses] = useState([])
    useEffect(() => {
        const getCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');
        
                const response = await fetch('http://localhost:39189/api/profile/get-profile', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
        
                if (!response.ok) throw new Error(data.msg || 'Failed to fetch profile');
                const data = await response.json();

                const enrollments = await fetch('http://localhost:39189/enrollment', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  }).then((res)=>res.json())
                const responses = await Promise.all(
                    enrollments.map(enr => fetch(`http://localhost:39189/course/${enr.course_id}`).then(res => res.json()))
                );
                setCourses(responses);
            } catch (error) {
                console.log(error)
            }
        }
        getCourses()
    },[])

    return (courses.length &&
        <div className='main'>
          <h1>MY ENROLLMENTS</h1>
          <hr />
          <div className="course-container">
            {courses.map((course, i) => (
              <div onClick={console.log("clicko!")} key={i}>
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
      )
}

export default Enrollment