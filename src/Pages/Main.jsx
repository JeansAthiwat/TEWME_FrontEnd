import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import CourseItem from '../Components/Course/Course';
import TutorItem from '../Components/Tutors/Tutors'; // ✅ Import TutorItem
=======
import CourseItem from '../Components/Course/CourseItem';
import TutorItem from '../Components/Tutors/TutorItem';
>>>>>>> Stashed changes
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Main.css';
import { 
  X
} from "lucide-react";

const API_URL = "http://localhost:39189/search";

const Main = ({ accountState }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("course");
  const [subjects, setSubjects] = useState([]);
  const [courseType, setCourseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const queries = subjects.length > 0 
          ? subjects.map(sub => `${API_URL}?category=${category}&subject=${sub}&query=${inputSearch}&sortBy=${sortBy}&courseType=${courseType}`)
          : [`${API_URL}?category=${category}&query=${inputSearch}&sortBy=${sortBy}&courseType=${courseType}`];

<<<<<<< Updated upstream
        console.log("📡 Fetching from API:", fullURL); // ✅ Log request
        const response = await axios.get(fullURL);

        console.log("✅ API Response:", response.data); // ✅ Log response data
        setItems(response.data || []);
=======
        console.log("📡 Fetching from API:", queries);
        
        const responses = await Promise.all(queries.map(url => axios.get(url)));
        responses.forEach((res, index) => console.log(`✅ API Response for ${queries[index]}:`, res.data));
        
        const allData = responses.flatMap(res => res.data || []);
        setItems(allData);
>>>>>>> Stashed changes
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [inputSearch, sortBy, category, subjects, courseType]);

<<<<<<< Updated upstream
  const handleItemClick = (item) => {
    if (accountState === "unregistered") {
      // alert("Please login to access content");
      navigate('/login');
    } else {
      const itemIden = category === "course" ? item.course_name : item.email; // ✅ ใช้ id ให้ถูกต้อง
      const newUrl = `/${category}/${itemIden}`;
      console.log("🔗 Navigating to:", newUrl); // ✅ Debug URL ก่อนเปลี่ยนหน้า
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
=======
  const handleSubjectChange = (subject) => {
    setSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
  };

  return (
    <div className="flex w-full p-5 gap-5">
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md sticky top-[115px] h-[calc(100vh-80px)] overflow-auto">
        <h2 className="font-bold text-lg mb-4">Filters</h2>
        
        <div className="flex justify-between mb-4 gap-2">
          <button 
            className={`w-1/2 p-2 rounded-lg ${category === "course" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => setCategory("course")}
          >
            Courses
          </button>
          <button 
            className={`w-1/2 p-2 rounded-lg ${category === "tutor" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => setCategory("tutor")}
          >
            Tutors
          </button>
        </div>
        
>>>>>>> Stashed changes
        <input 
          type="text" 
          placeholder="Search..." 
          value={inputSearch} 
          onChange={(e) => setInputSearch(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        
        <h3 className="font-semibold mb-2">Subjects</h3>
        <div className="flex flex-col gap-2 mb-4">
          {"Science Math Language Social Music Arts".split(" ").map(subject => (
            <label key={subject} className="flex items-center w-full cursor-pointer justify-begin">
              <input 
                type="checkbox" 
                checked={subjects.includes(subject)} 
                onChange={() => handleSubjectChange(subject)}
                className="w-5 h-5 accent-black rounded-md border-gray-400 "
              />
              <span className="text-left w-550">{subject}</span>
            </label>
          ))}
        </div>
        
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select 
          onChange={(e) => setSortBy(e.target.value)} 
          value={sortBy || ""} 
          className='w-full p-2 border rounded-md mb-4'
        >
          <option value="">Select Sort Option</option>
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
<<<<<<< Updated upstream
            <select onChange={(e) => setSubject(e.target.value)} value={subject || ""} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
              <option value="">All Subjects</option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="Language">Language</option>
              <option value="Social">Social</option>
              <option value="Music & Arts">Music & Arts</option>
            </select>

            <select onChange={(e) => setCourseType(e.target.value)} value={courseType || ""} className='p-3 border-2 border-blue-500 rounded-lg focus:border-blue-700'>
=======
            <h3 className="font-semibold mb-2">Course Type</h3>
            <select 
              onChange={(e) => setCourseType(e.target.value)} 
              value={courseType || ""} 
              className='w-full p-2 border rounded-md mb-4'
            >
>>>>>>> Stashed changes
              <option value="">All Course Types</option>
              <option value="Live">Live</option>
              <option value="Video">Video</option>
            </select>
          </>
        )}
      </div>

<<<<<<< Updated upstream
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
              profile_picture={item.profile_picture}
              specialization={item.specialization}
            />
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 w-full">No {category} found.</p>
    )}
=======
      <div className="w-3/4">
      {/* แสดง Subjects ที่เลือก */}
{subjects.length > 0 && (
  <div className="flex items-center gap-2 flex-wrap mb-4">
    {subjects.map(subject => (
      <div 
        key={subject} 
        className="flex items-center border border-gray-400 px-3 py-0.5 rounded-full text-gray-900 font-medium text-sm"
      >
        {subject}
        <button 
          onClick={() => handleSubjectChange(subject)} 
          className="ml-1 text-gray-500 hover:text-gray-700"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    ))}
    <button 
      onClick={() => setSubjects([])} 
      className="text-blue-600 text-sm font-medium hover:underline"
    >
      Clear all
    </button>
>>>>>>> Stashed changes
  </div>
)}

        {loading ? (
          <p className="text-center text-blue-500">Loading {category}...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div key={i}>
                  {category === "course" ? (
                    <CourseItem {...item} />
                  ) : (
                    <TutorItem {...item} />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">No {category} found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;