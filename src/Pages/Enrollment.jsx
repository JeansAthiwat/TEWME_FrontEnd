import React, { useState, useEffect } from 'react';
import CourseItem from '../Components/Course/CourseItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Main.css';

const API_URL = "http://localhost:39189/search/"; // ใช้ endpoint /search ตาม backend

const Main = ({ accountState }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [subject, setSubject] = useState("");
  const [courseType, setCourseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        // สร้าง query parameters ตามที่ backend รองรับ
        const params = {
          category: "course", // ดึงเฉพาะ course เสมอ
          query: inputSearch || undefined,
          sortBy: sortBy || undefined,
          subject: subject || undefined,
          courseType: courseType || undefined,
        };

        const response = await axios.get(API_URL, { params });
        setCourses(response.data || []);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [inputSearch, sortBy, subject, courseType]);

  const handleCourseClick = (courseId) => {
    if (accountState === "unregistered") {
      alert("Please login to access course content");
      navigate('/');
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div className='main'>
      <h1 className="text-3xl text-center text-gray-800 mb-5">ALL COURSES</h1>

      {/* Search Bar */}
      <div className="w-full mt-5">
        <input 
          type="text" 
          placeholder="Search Course..."
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className='w-full p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700 transition duration-300'
        />
      </div>

      {/* Sorting & Filters */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
          <option value="">Sort by</option>
          <option value="name">Name: A-Z</option>
          <option value="-name">Name: Z-A</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>

        <select onChange={(e) => setSubject(e.target.value)} value={subject} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
          <option value="">All Subjects</option>
          <option value="Science">Science</option>
          <option value="Math">Math</option>
          <option value="Language">Language</option>
        </select>

        <select onChange={(e) => setCourseType(e.target.value)} value={courseType} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
          <option value="">All Course Types</option>
          <option value="Live">Live</option>
          <option value="Video">Video</option>
        </select>
      </div>

      <hr className="my-10 border-gray-300" />

      {/* Loading & Error Handling */}
      {loading ? (
        <p className="text-center text-blue-500">Loading courses...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {courses.length > 0 ? (
            courses.map((course, i) => (
              <div onClick={() => handleCourseClick(course.course_id)} key={i}>
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
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">No courses found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
