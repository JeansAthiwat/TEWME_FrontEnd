import React, { useState, useEffect } from 'react';
import CourseItem from '../Components/Course/CourseItem';
import TutorItem from '../Components/Tutors/TutorItem'; // ✅ Import TutorItem
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Main.css';
import { X } from "lucide-react";
import HeroSection from '../Components/HeroSection/HeroSection';

const API_URL = "http://localhost:39189/search"; // ✅ เปลี่ยนเป็น '/search/'

const Main = ({ accountState }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // ใช้ทั้ง tutor/course
  const [inputSearch, setInputSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // ✅ ค่าเริ่มต้นเป็น "name"
  const [category, setCategory] = useState("course"); // ✅ ค่าเริ่มต้นเป็น "course"
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

        console.log("📡 Fetching from API:", queries);
        
        const responses = await Promise.all(queries.map(url => axios.get(url)));
        responses.forEach((res, index) => console.log(`✅ API Response for ${queries[index]}:`, res.data));
        
        const allData = responses.flatMap(res => res.data.data || []);
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
      
      console.log("🔗 Navigating to:", newUrl); // ✅ เช็คว่า URL ที่จะไปถูกต้องไหม
  
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
    <>
      <HeroSection />
    </>
  );
};
export default Main;