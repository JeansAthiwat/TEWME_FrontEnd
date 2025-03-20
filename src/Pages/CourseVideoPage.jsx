import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import VideoPlayer from '../Components/VideoPlayer/VideoPlayer';
import SupplementaryMaterial from '../Components/SupplementaryMaterial/SupplementaryMaterial';
import StarRating from '../Components/StarRating/StarRating';
import axios from 'axios';
import {
  Clock, 
  GraduationCap,
  ChevronDown,
  Play,
  CirclePlay
} from 'lucide-react';

const CourseVideoPage = () => {
  const { courseId } = useParams();
  console.log(courseId);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // เรียกข้อมูลหลักของคอร์ส
        const response = await fetch(`http://localhost:39189/course/${courseId}`);
        const data = await response.json();
        console.log("Data: ", data);

        // ตรวจสอบว่า data.tutor มีค่าหรือไม่
        if (data.tutor) {
          const userResponse = await axios.get(`http://localhost:39189/user/id/${data.tutor}?select=firstname,lastname,bio,profilePicture`);
          const tutorWithUserData = { ...data.tutor, user: userResponse.data };
          setCourse({ ...data, tutor: tutorWithUserData });
        } else {
          console.error("Tutor not found");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [courseId]); // เรียกใช้ fetchData เมื่อ courseId เปลี่ยนแปลง

  console.log("Course Data: ", course);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (course && course.videos.length > 0) {
      setCurrentLesson(course.videos[0]);// เลือก video แรกเพื่อเริ่มเล่น
    }
  }, [courseId]);

  const handleVideoSelect = (video) => {
    setCurrentLesson(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  console.log("Current :" ,currentLesson);
  

  if (!course) {
    return (
      <div className="min-h-screen">
        <div className="pt-32 pb-16 px-6 md:px-10 flex items-center justify-center">
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <section className="pt-10 pb-8 px-6 md:px-10 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {course.subject}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.course_name}</h1>
            
            <p className="text-muted-foreground max-w-3xl mb-6">{course.course_description}</p>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img src={course.tutor.user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span>Instructor: <span className="font-medium">{course.tutor.user.firstname + ' ' + course.tutor.user.lastname}</span></span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{course.course_length} Hrs</span>
              </div>
              
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>{course.course_capacity} students</span>
              </div>
              
              <div className="flex items-center">
                <StarRating rating={course.ratings.average} size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video and Materials (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-8">
              {currentLesson && (
                <>
                  <div className="animate-fade-in">
                    <VideoPlayer 
                      src={currentLesson.video_urls} 
                      title={currentLesson.video_title}
                      poster={course.image}
                      className="rounded-2xl overflow-hidden aspect-video shadow-lg"
                    />
                  </div>
                  
                  <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{currentLesson.video_title}</h2>
                      <p className="text-sm text-muted-foreground">Published on: {new Date(currentLesson.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    
                    {/* {videoMaterials[currentLesson.video_id] && (
                      <SupplementaryMaterial materials={videoMaterials[currentLesson.video_id]} />
                    )} */}
                  </div>
                </>
              )}
            </div>
          
          {/* Course Outline (1/3 width on large screens) */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="sticky top-24 glass-card bg-white rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6">Course Videos</h3>
                
                <div className="space-y-4">
                  {course.videos.map((video) => (
                    <button
                      key={video.video_id}
                      className={`w-full px-4 py-3 flex items-center text-left hover:bg-gray-50 transition-colors rounded-xl ${
                        currentLesson?.video_id === video.video_id 
                          ? 'bg-blue-50 font-medium border border-blue-200' 
                          : 'border border-gray-200'
                      }`}                    
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="mr-3 flex-shrink-0">
                        {currentLesson?.video_id === video.video_id ? (
                          <Play className="text-primary stroke-blue-500" size={18} />
                        ) : (
                          <CirclePlay className="text-muted-foreground" size={18} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <span className="line-clamp-2">{video.video_title}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {new Date(video.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
    </div>
  );
};


export default CourseVideoPage;
