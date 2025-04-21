import React, { useState, useEffect } from 'react';
import CourseItem from '../Components/Course/CourseItem';
import TutorItem from '../Components/Tutors/TutorItem'; // ✅ Import TutorItem
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Main.css';
import { X } from "lucide-react";
import LoadingScreen from '../Components/LoadingScreen/LoadingScreen';


const API_URL = "/api/search"; // ✅ เปลี่ยนเป็น '/search/'

const Main = ({ accountState}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // ใช้ทั้ง tutor/course
  const [inputSearch, setInputSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // ✅ ค่าเริ่มต้นเป็น "name"
  const [category, setCategory] = useState(localStorage.getItem('category') || 'course'); // ✅ ค่าเริ่มต้นเป็น "course"
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
      
      // console.log("📡 Fetching from API:", queries);
      
      const responses = await Promise.all(queries.map(url => axios.get(url)));

      responses.forEach((res, index) => console.log(`✅ API Response for ${queries[index]}:`, res.data));
      
      // Flatten and deduplicate based on course ID
      const allDataRaw = responses.flatMap(res => res.data.data || []);
      const seen = new Set();
      const allData = allDataRaw.filter(item => {
        if (seen.has(item._id)) return false;
        seen.add(item._id);
        return true;
      });
      
        setItems(allData);
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [inputSearch, sortBy, category, subjects, courseType]);

  const handleItemClick = (item) => {
    if (accountState === "unregistered") {
      navigate('/login', { replace: true });
    } else {
      const itemIden = item._id; // ✅ ตรวจสอบว่า _id มีค่าจริงไหม
      const newUrl = `/${category}/${itemIden}`;
      
      // console.log("🔗 Navigating to:", newUrl); // ✅ เช็คว่า URL ที่จะไปถูกต้องไหม
  
      if (itemIden) {
        navigate(newUrl, { replace: true });
      } else {
        console.error("❌ Invalid item identifier:", item);
      }
    }
  };
  

  const handleSubjectChange = (subject) => {
    setSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-400 m-auto p-5 gap-5">
      <div className="md:w-1/4 p-4 bg-gray-100 rounded-lg shadow-md sticky md:top-[100px] md:h-[calc(90vh-80px)] md:overflow-auto">
        <h2 className="hidden md:block font-bold text-lg mb-4">Filters</h2>
        
        <div className="flex md:justify-between mb-4 gap-2">
          <button 
            className={`w-40 md:w-1/2 p-2 rounded-lg ${category === "course" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => {
              setCategory("course")
              localStorage.setItem('category', 'course')
            }
            }
          >
            Courses
          </button>
          <button 
            className={`w-40 md:w-1/2 p-2 rounded-lg ${category === "tutor" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
            onClick={() => {
              setCategory("tutor")
              localStorage.setItem('category', 'tutor')
            }}
          >
            Tutors
          </button>
        </div>
        
        <input 
          type="text" 
          placeholder="Search..." 
          value={inputSearch} 
          onChange={(e) => setInputSearch(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        { category === 'course' &&<>
        
        <h3 className="hidden md:blcok font-semibold mb-2">Tags</h3>
        <div className="hidden md:flex flex-col gap-2 mb-4">
          {"Science Math Language Social Music Art".split(" ").map(subject => (
            <label key={subject} className="flex items-center w-full cursor-pointer justify-begin">
              <input 
                type="checkbox" 
                checked={subjects.includes(subject)} 
                onChange={() => handleSubjectChange(subject)}
                className="w-5 h-5 accent-black rounded-md border-gray-400 "
              />
              <span className="px-2 text-left w-550">{subject}</span>
            </label>
          ))}
        </div>
        </>}
        
        <h3 className=" hidden md:block font-semibold mb-2">Sort By</h3>
        <select 
          onChange={(e) => setSortBy(e.target.value)} 
          value={sortBy || ""} 
          className='hidden md:block w-full p-2 border rounded-md mb-4'
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
            <h3 className="hidden md:block font-semibold mb-2">Course Type</h3>
            <select 
              onChange={(e) => setCourseType(e.target.value)} 
              value={courseType || ""} 
              className='hidden md:block w-full p-2 border rounded-md mb-4'
            >
              <option value="">All Course Types</option>
              <option value="Live">Live</option>
              <option value="Video">Video</option>
            </select>
          </>
        )}
      </div>
  
      <div className="w-full md:w-3/4">
      {/* Search Term Display */}
{inputSearch && (
  <h2 className="text-xl font-semibold mb-4">
    Results for <span className="text-black-600">"{inputSearch}"</span>
  </h2>
)}
      {/* แสดง Subjects ที่เลือก */}
  {category==='course' && subjects.length > 0 && (
  <div className="flex items-center gap-2 flex-wrap mb-4">
    {subjects.map(subject => (
      <div 
        key={subject} 
        className="flex  items-center border border-gray-400 px-3 py-0.5 rounded-full text-gray-900 font-medium text-sm"
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
  </div>
  )}
  
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div key={i} onClick={() => handleItemClick(item)}>
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