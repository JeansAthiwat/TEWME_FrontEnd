import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { data, Link, useParams } from "react-router-dom";
// import CourseItem from "../Components/Course/CourseItem";
import './CSS/Course.css';
import StarRating from "../Components/StarRating/StarRating";
import DefaultPic from "../Components/Assets/course_id1.png";
import CourseReview from "../Components/CourseReview/CourseReview";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  ChevronRight,
  Share2,
  ArrowRight,
  GraduationCap,
  Calendar,
  MapPin,
  Library,
  Banknote,
  CircleCheck,
  CircleX
} from 'lucide-react';
import LoadingScreen from "../Components/LoadingScreen/LoadingScreen";

const Course = () => {
  
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(false);
  const user_id = localStorage.getItem('UID');

  useEffect(() => {
    const getCourse = async () => {
      const response = await fetch(`/api/course/${courseId}`);
      const data = await response.json();
      // console.log("Course Data: ", data); // ดูข้อมูลที่ได้รับ
      // console.log("Tutor : ", data.tutor); // ดูข้อมูลที่ได้รับ

      // ดึงข้อมูลผู้ใช้สำหรับ tutor
      const userResponse = await axios.get(`/api/user/id/${data.tutor}?select=firstname,lastname,bio,profilePicture`);
      // console.log("Tutor Data: ", userResponse); // ดูข้อมูลที่ได้รับ
      const tutorWithUserData = { ...data.tutor, user: userResponse.data }; // รวมข้อมูลผู้ใช้เข้ากับ tutor
      console.log(data.supplementary_file)
      setCourse({ ...data, tutor_id:data.tutor, tutor: tutorWithUserData }); // อัปเดต course ด้วยข้อมูล tutor
      setVideos(data.videos)
    };
    getCourse();
  }, [courseId]);

  useEffect(() => {
    if(localStorage.getItem("accountState") === "tutor") {
      return;
    }
    const getReservation = async () => {
      const response = await fetch(`/api/reservation?course=${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      console.log('Reservation: ',data)
      if(data.count) {
        setEnrollmentStatus(true);
      }
    }
    getReservation();
  },[courseId])

  // Handler to download the supplementary file
  const handleDownload = () => {
      const file = course.supplementary_file
      // Convert Buffer data to Uint8Array
      const byteArray = new Uint8Array(file.data.data);
    
      // Create a Blob
      const blob = new Blob([byteArray], { type: file.contentType });
    
      // Create a temporary URL
      const url = URL.createObjectURL(blob);
    
      // Create a temporary anchor tag to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    
      // Clean up the object URL
      URL.revokeObjectURL(url);
    
  };
  // Format date into a readable string
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch(`/api/course/${courseId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      // console.log(data);
      
      const createChatResponse = await fetch(`/api/conversation/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [course.tutor_id, localStorage.getItem("UID")],
          courseId: courseId,
        }),
      });
      

      if (!createChatResponse.ok) {
        throw new Error(`Chat create error! Status: ${createChatResponse.status}`);
      }
      setEnrollmentStatus(true);
    } catch (error) {
      console.error("Enrollment failed:", error);
      setEnrollmentStatus(false);
    } finally {
      setModalMode(true);
    }
  };

  return course ? (

    
    <div className="min-h-screen  bg-gray-50 py-10 px-6">
      {/* Course Header */}
        <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="mb-6 flex items-center text-sm text-gray-500">
                  {/* <Link to="/" className="hover:text-gray-700">Home</Link> */}
                  {/* <ChevronRight className="w-4 h-4 mx-2" /> */}
                  <Link to="/main" className="hover:text-gray-700">Courses</Link>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <span className="text-gray-800 font-semibold">{course.course_name}</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Course Image */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-card">
                    {/* <div 
                      className={cn(
                        "absolute inset-0 bg-gray-200 animate-pulse", 
                        imageLoaded ? "opacity-0" : "opacity-100"
                      )}
                    /> */}
                    <img 
                    src={course.course_profile || DefaultPic} 
                    alt={course.course_name} 
                    className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {/* {course.category.map((cat) => (
                        <Badge key={cat} variant="default" className="backdrop-blur-md">
                          {cat}
                        </Badge>
                      ))} */}
                    </div>
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex flex-col justify-center">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.course_name}</h1>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <StarRating rating={course.ratings.average} size={25} className="mr-3" />
                          <span className="ml-1 text-base font-medium">{course.ratings.average.toFixed(1)} ★ ({course.ratings.totalReviews})</span>
                        </div>
                        <button className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Share course">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center px-4 py-2 rounded-lg bg-gray-100">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{course.course_length} Hours</span>
                        </div>
                        <div className="flex items-center px-4 py-2 rounded-lg bg-gray-100">
                          <Library className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{course.tags.join(', ')}</span>
                        </div>
                        <div className="flex items-center px-4 py-2 rounded-lg bg-gray-100">
                          <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{course.course_type}</span>
                        </div>
                      </div>

                      {/* <div className="mt-auto flex flex-col sm:flex-row gap-4"> */}
                      {localStorage.getItem("accountState") === 'learner' && !enrollmentStatus ? (
                      <div className="flex space-x-4">
                        <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all sm:flex-1 flex justify-center items-center"
                          onClick={() => setIsModalOpen(true)}>
                          <Award className="w-5 h-5 mr-2" />
                          Enroll Now
                        </button>
                        {/* <button className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors sm:flex-1 flex justify-center items-center">
                          Preview Course
                        </button> */}
                      </div>
                      ) : (
                        <button className="px-6 py-3 rounded-xl border border-gray-600 text-gray-600 px-6 py-3 rounded-lg w-full">
                          {localStorage.getItem("accountState") === 'learner'? "You Already Enrolled" : "Only learner can enroll"}
                        </button>
                      )}
                  </div>
                </div>
        </div>
      
      {/* Course Description */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-display font-bold mb-6">About This Course</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {course.course_description}
                </p>
              </div>

              {/* Course Contents (for enrolled learner) */}
              {(enrollmentStatus || course.tutor_id === localStorage.getItem('UID') )&&
              <div className="course-content">
                <h2 className="text-2xl font-display font-bold  mb-6">Content</h2>
                {course.supplementary_file? <button onClick={handleDownload} className='text-blue-600 underline hover:text-blue-500 mb-6'> {course.supplementary_file.fileName} </button>
                :<p className="mb-6">No content</p>}
                <h3 className="text-xl font-display font-bold mb-6">Videos</h3>
                <ul className='video-list list-disc'>
                  {
                    videos.map((video,index) =>  <li className='ml-7' key={index}><Link to={`/course/${courseId}/video/${index}`} className='text-blue-600 underline hover:text-blue-500'>{video.video_title}</Link></li>)
                  }
                </ul>
              </div>
              }

              {/* Instructor */}
              <div className="mt-10">
                <h2 className="text-2xl font-display font-bold mb-6">Meet Your Instructor</h2>
                <div className="flex items-start p-6 rounded-xl bg-white border border-gray-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary mr-4 flex-shrink-0">
                    <img 
                      src={course.tutor.user.profilePicture}
                      alt={course.tutor.user.firstname + ' ' + course.tutor.user.lastname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">{course.tutor.user.firstname + ' ' + course.tutor.user.lastname}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {/* Expert in {course.category.join(', ')} */}
                    </p>
                    <p className="text-sm text-muted-foreground">
                     {course.tutor.user.bio}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Reviews */}
              <CourseReview course = {course} enrollmentStatus = {enrollmentStatus}/>

            </div>
            
            {/* Sidebar */}
            <div>
              <div className="sticky top-30 rounded-xl bg-white border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-4">Course Details</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: <Clock className="w-5 h-5" />, label: 'Duration', value: course.course_length + " Hrs"},
                      { icon: <Users className="w-5 h-5" />, label: 'Instructor', value: course.tutor.user.firstname + ' ' + course.tutor.user.lastname },
                      { icon: <GraduationCap className="w-5 h-5" />, label: 'Capacity', value: course.course_capacity + " Persons" },
                      { icon: <Banknote className="w-5 h-5"/>, label: 'Price', value: course.price + " Baht"},
                      // เพิ่มข้อมูล location และ start_time ถ้า course_type เป็น "Live"
                      ...(course.course_type === "Live" ? [
                        { icon: <BookOpen className="w-5 h-5" />, label: 'Location', value: "Room 101, ABC Institute" },
                        { icon: <Clock className="w-5 h-5" />, label: 'Start Time', value: new Date("2025-03-01T10:00:00.000Z").toLocaleString() }
                      ] : []),
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-medium">{item.value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>                
                <div className="border-t border-gray-100 p-6">

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Courses */}
      <section className="py-16 px-6 md:px-10 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-bold">Related Courses</h2>
            <Link 
              to={`/tutor/${course.tutor_id}`} 
              className="group inline-flex items-center text-primary font-medium mt-4 md:mt-0"
            >
              View tutor profile
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content ">
            {!modalMode ?
              (<>
                <h3 className="font-bold">Confirm Your Enrollment</h3>
                <p>Course: {course.course_name}</p>
                <p>Price: {course.price} Baht</p>
                <div className="modal-actions">
                  <button onClick={handleEnroll} className="update-btn">Confirm</button>
                  <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                </div>
              </>):
              (enrollmentStatus ? (<>
                <h3 className="font-bold">Enrollment Success</h3>
                <div className="flex justify-center pb-5">
                  <CircleCheck className="w-[15%] h-[15%] mr-2 text-[#77bb41]" />
                </div>
                <button onClick={() => {setIsModalOpen(false);setModalMode(false);}} className="update-btn">Close</button>
              </>):
              (<>
                <h3 className="font-bold">Enrollment Fail {enrollmentStatus}</h3>
                <div className="flex justify-center pb-5">
                  <CircleX className="w-[15%] h-[15%] mr-2 text-[#e32400]" />
                </div>
                <button onClick={() => {setIsModalOpen(false);setModalMode(false);}} className="update-btn">Close</button>
              </>)
              )
            }
          </div>
        </div>
      )}
    </div>
    
  ) : (
    <div className="">
      <LoadingScreen />
    </div>
  );
};

export default Course;
