import React, { useEffect, useState } from "react";
import "./CSS/Mycourse.css";
import MultiStepForm from "./MultiStepForm";
import { FaCalculator, FaFlask, FaCode, FaPaintBrush, FaLanguage, FaMusic, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Video, MapPin , UserRound, Star } from 'lucide-react';
import LoadingScreen from "../Components/LoadingScreen/LoadingScreen";
const Mycourse = ({  email }) => {
  
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseType, setCourseType] = useState('All')
  const UID = localStorage.getItem("UID");
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/course/tutor/${UID}`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
        
        console.log(data)
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
    
  }, [UID, email]); // Added `tutor_id` as a dependency
  

  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`/api/course/${courseId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Failed to delete course");
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const getSubjectColor = (subject) => {
    const colorMap = {
      'Math': '#3b82f6',      // Blue
      'Science': '#10b981',   // Green
      'Programming': '#6366f1', // Indigo
      'Art': '#ec4899',       // Pink
      'Language': '#f59e0b',  // Amber
      'Music': '#8b5cf6'      // Purple
    };
    return colorMap[subject] || '#64748b'; // Default gray
  };

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'Math': <FaCalculator />,
      'Science': <FaFlask />,
      'Programming': <FaCode />,
      'Art': <FaPaintBrush />,
      'Language': <FaLanguage />,
      'Music': <FaMusic />
    };
    return iconMap[subject] || <FaCalculator />;
  };

  return loading ? <LoadingScreen /> : (

      <div className=' w-[90vw] gap-5 relative  justify-center m-auto my-30 md:max-w-300 flex flex-col-reverse md:flex-row min-h-screen '>

        <div className="p-4  border-gray-200 md:border-r-1 left-0 gap-3 flex flex-col  w-full min-w-70 md:max-w-100 md:max-w-200 ">
            <h1 className='font-semibold text-3xl'>My courses</h1>
            <div className='flex flex-row gap-2'>
            <TypeButton onClick={()=> setCourseType('All')} type={'All'} currenType={courseType} />
            <TypeButton onClick={()=> setCourseType('Video')} type={'Video'} currenType={courseType} />
            <TypeButton onClick={()=> setCourseType('Live')} type={'Live'} currenType={courseType} />
            </div>
            <div className=' flex flex-col gap-2 '>
              {courses.map((course) => 
              (courseType==='All' || courseType=== course.course_type) && <Link to={`/course/${course._id}`} key={course._id}
              className='hover:text-blue-600 hover:border-blue-600 rounded-md border-gray-400 border-1 flex flex-col p-3 gap-2'>
                <div className='flex flex-row justify-between'>
                  <h2 className='truncate text-lg '>{course.course_name}</h2>
                  {course.course_type === 'Video' ? 
                  <div className='flex flex-row gap-[2px] items-center'>
                    <p className='hidden md:block text-sm '>Video</p><Video className='h-full' />
                  </div> 
                  : <div className='flex flex-row gap-[2px] items-center'>
                    <p className='hidden md:block text-sm'>Live</p><MapPin className='h-full text-red-600' />
                    </div>}
                </div>
                <div className='flex flex-row gap-2'>{course.tags?.map((t,i) => 
                  <h3 key={i} className={`text-blue-600 truncate text-[14px]`}>{t}</h3>)}
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-1">
                      <Star className="text-yellow-400 fill-yellow-400"/>
                      <p> {course.ratings.average || 0} ({course.ratings.totalReviews || 0}) </p>
                    </div>
                    <div className="flex flex-row">
                    <p className="">{course.reservation_count}/{course.course_capacity}</p>
                    <UserRound />
                      </div>
                  </div>
                {/* <p className='text-gray-400 text-sm'>Bought at {new Date(e.payment_date).toLocaleString()}</p> */}
              </Link>)}
            </div>
            </div>
        <div className="flex flex-col items-center m-4 gap-2 md:w-full md:max-w-70 lg:max-w-100   md:sticky md:top-40 h-fit border-gray-400 border-1 rounded-lg p-4">
          <div className="">
              <span className="mycourse-count-number">{courses.length}</span>
              <span className="mycourse-count-text"> Courses</span>
          </div>
          <div className="">
              <span className="mycourse-count-number">{courses.map((course) => course.reservation_count).reduce((a, c) => a+c)}</span>
              <span className="mycourse-count-text"> Students</span>
          </div>
          <div className="">
            <button className="bg-blue-600 rounded-xl p-2 text-white" onClick={openModal}>
              Create New Course
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1000 }}>
            <div className="modal-content relative" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1001 }}>
              <button 
                className="close-button absolute top-2 right-2 text-gray-700 hover:text-gray-900 transition duration-200"
                onClick={closeModal}
              >
                <FaTimes className="w-6 h-6" />
              </button>
              <MultiStepForm setCourses={setCourses} tutorID={UID} tEmail={email} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
      );
};

const TypeButton = ({type, currenType, onClick}) => {

  return    <button onClick={onClick} className={`border-1  rounded-xl w-20 ${type===currenType ? ' bg-blue-600 text-white': 'hover:bg-blue-200 border-gray-600'} `}>
        {type}
  </button>
}

export default Mycourse;
