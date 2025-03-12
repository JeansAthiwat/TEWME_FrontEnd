import React, { useState, useEffect } from 'react';
import CourseItem from '../Components/Course/Course';
import TutorItem from '../Components/Tutors/Tutors'; // ✅ Import TutorItem
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Main.css';

const API_URL = "http://localhost:39189/search"; // ✅ เปลี่ยนเป็น '/search/'

const Main = ({ accountState }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // ใช้ทั้ง tutor/course
  const [inputSearch, setInputSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // ✅ ค่าเริ่มต้นเป็น "name"
  const [category, setCategory] = useState("course"); // ✅ ค่าเริ่มต้นเป็น "course"
  const [subject, setSubject] = useState("");
  const [courseType, setCourseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ สร้าง params โดยไม่รวมค่า undefined
        const params = {
          category,
          ...(inputSearch && { query: inputSearch }),
          ...(sortBy && { sortBy }),
          ...(category === "course" && subject && { subject }),
          ...(category === "course" && courseType && { courseType }),
        };
        const queryString = new URLSearchParams(params).toString();
        const fullURL = `${API_URL}?${queryString}`;

        // console.log("📡 Fetching from API:", fullURL); // ✅ Log request
        const response = await axios.get(fullURL);

        // console.log("✅ API Response:", response.data); // ✅ Log response data
        setItems(response.data || []);
      } catch (err) {
        console.error("❌ API Error:", err); // ✅ Log error
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [inputSearch, sortBy, category, subject, courseType]);

  const handleItemClick = (item) => {
    if (accountState === "unregistered") {
      // alert("Please login to access content");
      navigate('/login');
    } else {
      const itemIden = category === "course" ? item._id : item.email; // ✅ ใช้ id ให้ถูกต้อง
      const newUrl = `/${category}/${itemIden}`;
      // console.log("🔗 Navigating to:", newUrl); // ✅ Debug URL ก่อนเปลี่ยนหน้า
      navigate(newUrl);
    }
  };

  return (
    <div className='main'>
      <h1 className="text-3xl text-center text-gray-800 mb-5">{category === "course" ? "ALL COURSES" : "ALL TUTORS"}</h1>

      {/* Category Filter */}
      <div className="w-full flex justify-center items-center gap-4">
        <button 
          className={`p-2 rounded-lg ${category === "course" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
          onClick={() => setCategory("course")}
        >
          Courses
        </button>
        <button 
          className={`p-2 rounded-lg ${category === "tutor" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
          onClick={() => setCategory("tutor")}
        >
          Tutors
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full mt-5">
        <input 
          type="text" 
          placeholder={`Search ${category}...`}
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          className='w-full p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700 transition duration-300'
        />
      </div>

      {/* Sorting & Filters */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy || ""} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
          <option value="">Sort by</option>
          <option value="name">Name: A-Z</option>
          <option value="-name">Name: Z-A</option>
          {category === "course" && (
            <>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </>
          )}
        </select>

        {category === "course" && (
          <>
            <select onChange={(e) => setSubject(e.target.value)} value={subject || ""} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
              <option value="">All Subjects</option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="Language">Language</option>
              <option value="Social">Social</option>
              <option value="Music">Music</option>
              <option value="Arts">Arts</option>
            </select>

            <select onChange={(e) => setCourseType(e.target.value)} value={courseType || ""} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
              <option value="">All Course Types</option>
              <option value="Live">Live</option>
              <option value="Video">Video</option>
            </select>
          </>
        )}
      </div>

      <hr className="my-10 border-gray-300" />

      {/* Loading & Error Handling */}
      {loading ? (
        <p className="text-center text-blue-500">Loading {category}...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">

    {items.length > 0 ? (
      items.map((item, i) => (
        <div onClick={() => handleItemClick(item)} key={i}>
          {category === "course" ? (
            <CourseItem
              // course_id={item.course_id}
              course_name={item.course_name}
              image={item.image}
              price={item.price}
              subject={item.subject}
              course_length={item.course_length}
              course_type={item.course_type}
            />
          ) : (
            <TutorItem
              // tutor_id={item.tutor_id}
              firstname={item.firstname}
              lastname={item.lastname}
              profilePicture={item.profilePicture}
              specialization={item.specialization}
              email={item.email}
            />
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 w-full">No {category} found.</p>
    )}
  </div>
      )}
    </div>
  );
};

export default Main;
