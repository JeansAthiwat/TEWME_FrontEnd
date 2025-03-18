import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { 
  CheckCircle, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Phone, 
  Mail, 
  ArrowLeft,
  BookText,
  Star,
  Award,
  Globe,
  Clock,
  Users
} from "lucide-react";

const TutorProfile = () => {
  const { tutorId } = useParams();
  useEffect(() => {
    console.log("Email from URL:", tutorId);
  }, [tutorId]); // เมื่อ email เปลี่ยน ให้ log ค่าใหม่
  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // เรียก API ดึงคอร์สทั้งหมด
        // const courseRes = await axios.get("http://localhost:39189/search?category=course");
        // console.log("📌 Course Data:", courseRes.data);
        // เรียก API ดึงข้อมูลติวเตอร์ทั้งหมด
        // const tutorRes = await axios.get("http://localhost:39189/search?category=tutor");
        // console.log("📌 Tutor Data:", tutorRes.data);
        // 🔹 กรองเฉพาะคอร์สที่มี t_email ตรงกับ email บน URL
        // const tutorCourses = courseRes.data.filter(course => course.t_email === email);
        // console.log("🎯 Filtered Tutor Courses:", tutorCourses);
        // 🔹 หาข้อมูลของติวเตอร์จาก API
        // const tutorData = tutorRes.data.find(user => user.email === email);
        // console.log("🎯 Found Tutor Data:", tutorData);

        const tutorCourses = await axios.get(`http://localhost:39189/course?tutor=${tutorId}&page=1&limit=5`);
        console.log("📌 Tutor Course Data:", tutorCourses.data.data);

        const tutorData = await axios.get(`http://localhost:39189/user/id/${tutorId}`);
        console.log("🎯 Found Tutor Profile Data:", tutorData.data);

        setCourses(tutorCourses.data.data);
        setTutor(tutorData.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId]);

  // useEffect(() => {
  //   console.log("Tutor Data:", tutor);
  //   console.log("Courses Data:", courses);
  // }, [tutor, courses]); // ให้ useEffect ทำงานเมื่อค่าเปลี่ยน

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-page">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-tutor-light-purple mb-4"></div>
          <div className="h-8 w-48 bg-tutor-light-purple rounded mb-4"></div>
          <div className="h-4 w-64 bg-tutor-light-purple rounded"></div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Tutor Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the tutor you're looking for.
          </p>
          <Link
            to="/main"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 md:py-12">
        <button 
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm font-medium transition-all duration-300 ease-out hover:text-blue-600 mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to tutors
        </button>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={tutor.profilePicture}
                    alt={`${tutor.firstname} ${tutor.lastname}`}
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 shadow-sm"
                  />
                  {tutor.verification_status && (
                    <div className="absolute bottom-0 right-0 rounded-full bg-green-500 p-1 text-white">
                      <CheckCircle size={18} />
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl font-semibold text-gray-800">
                  {tutor.firstname} {tutor.lastname}
                </h1>
                
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {tutor.specialization.slice(0, 3).map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{tutor.email}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>{tutor.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="font-medium text-lg mb-4 flex items-center text-gray-800">
                <GraduationCap size={20} className="mr-2 text-blue-600" />
                Education
              </h2>
              <ul className="space-y-3">
                {tutor.educations.map((education, index) => (
                  <li key={index} className="text-sm leading-relaxed text-gray-600 pl-3 py-1">
                    {education}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="profile-section rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="font-medium text-lg mb-4 flex items-center text-gray-800">
                <BookOpen size={20} className="mr-2 text-blue-600" />
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.specialization.slice(0, 3).map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Bio and Teaching Style */}
          <div className="md:col-span-2 space-y-6">
            <div className="profile-section rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="font-medium text-lg mb-4 flex items-center text-gray-800">
                <Users size={20} className="mr-2 text-blue-600" />
                Bio
              </h2>
              <p className="text-md leading-relaxed text-gray-700">{tutor.bio}</p>
            </div>
            
            <div className="profile-section rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="font-medium text-lg mb-4 flex items-center text-gray-800">
                <Lightbulb size={20} className="mr-2 text-blue-600" />
                Teaching Style
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tutor.teaching_style.map((style, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-tutor-purple hover:shadow-md"
                  >
                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-tutor-light-purple">
                      <CheckCircle size={16} className="text-tutor-purple" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">{style}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="profile-section rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="font-medium text-lg mb-4 flex items-center text-gray-800">
                <BookText size={20} className="mr-2 text-blue-600" />
                Courses Offered
              </h2>
        
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={index} className="p-4 border border-gray-200 bg-white rounded-lg hover:border-blue-300 hover:shadow-md transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{course.course_name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{course.subject}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs rounded-full bg-blue-100 px-2 py-0.5 text-blue-600">
                            {course.course_type}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {course.price} Baht
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-start">
                        <button 
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => navigate(`/course/${course._id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {tutor.firstname} doesn't have any courses available at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* <footer className="border-t py-8">
        <div className="page-container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">© 2023 TutorVerse. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default TutorProfile;