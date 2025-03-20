import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
// import CourseItem from "../Components/Course/CourseItem";
import StarRating from "../Components/StarRating/StarRating";
import ReviewCard from "../Components/ReviewCard/ReviewCard";
import DefaultPic from "../Components/Assets/course_id1.png";
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
  Library
} from 'lucide-react';

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // เรียกข้อมูลหลักของคอร์ส
        const response = await fetch(`http://localhost:39189/course/${courseId}`);
        const data = await response.json();

        // ตรวจสอบว่า data.tutor มีค่าหรือไม่
        if (data.tutor) {
          const userResponse = await axios.get(`http://localhost:39189/user/id/${data.tutor}?select=firstname,lastname,bio,profilePicture`);
          const tutorWithUserData = { ...data.tutor, user: userResponse.data };
          setCourse({ ...data, tutor: tutorWithUserData });
        } else {
          console.error("Tutor not found");
        }

        // เรียกข้อมูลรีวิว
        const reviewResponse = await fetch(`http://localhost:39189/review/course/${courseId}`);
        const reviewData = await reviewResponse.json();
        const reviewsWithUserData = await Promise.all(reviewData.map(async (review) => {
          const userResponse = await axios.get(`http://localhost:39189/user/id/${review.reviewer_id._id}?select=firstname,lastname,profilePicture`);
          return { ...review, user: userResponse.data };
        }));
        setReviews(reviewsWithUserData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [courseId]); // เรียกใช้ fetchData เมื่อ courseId เปลี่ยนแปลง

  console.log("Course Data: ", course);
  console.log("Review Data: ", reviews);

  useEffect(() => {
    if (course) setVideos(course.videos);
  }, [course]);

  // Handler to download the supplementary file
  const handleDownload = () => {
    window.open(`http://localhost:39189/course/${courseId}/supplementary`, "_blank");
  };
  // Format date into a readable string
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return course ? (
    // <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded space-y-6">
    //   {/* Header */}
    //   <header className="border-b pb-4">
    //     <h1 className="text-3xl font-bold text-gray-800">{course.course_name}</h1>
    //     {course.course_description && (
    //       <p className="mt-2 text-lg text-gray-600">{course.course_description}</p>
    //     )}
    //   </header>

    //   {/* Detailed Course Info */}
    //   <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     <div className="space-y-2">
    //       {course.subject && (
    //         <div>
    //           <span className="font-semibold text-gray-700">Subject:</span>{" "}
    //           <span className="text-gray-600">{course.subject}</span>
    //         </div>
    //       )}
    //       <div>
    //         <span className="font-semibold text-gray-700">Price:</span>{" "}
    //         <span className="text-gray-600">${course.price.toFixed(2)}</span>
    //       </div>
    //       <div>
    //         <span className="font-semibold text-gray-700">Course Length:</span>{" "}
    //         <span className="text-gray-600">{course.course_length} hours</span>
    //       </div>
    //       <div>
    //         <span className="font-semibold text-gray-700">Capacity:</span>{" "}
    //         <span className="text-gray-600">{course.course_capacity} students</span>
    //       </div>
    //       <div>
    //         <span className="font-semibold text-gray-700">Status:</span>{" "}
    //         <span className="text-gray-600">{course.session_status}</span>
    //       </div>
    //       <div>
    //         <span className="font-semibold text-gray-700">Course Type:</span>{" "}
    //         <span className="text-gray-600">{course.course_type}</span>
    //       </div>
    //       <div>
    //         <span className="font-semibold text-gray-700">Created Date:</span>{" "}
    //         <span className="text-gray-600">{formatDate(course.created_date)}</span>
    //       </div>
    //       {course.tags && course.tags.length > 0 && (
    //         <div>
    //           <span className="font-semibold text-gray-700">Tags:</span>{" "}
    //           <span className="text-gray-600">{course.tags.join(", ")}</span>
    //         </div>
    //       )}
    //       {course.live_detail && course.course_type === "Live" && (
    //         <>
    //           {course.live_detail.location && (
    //             <div>
    //               <span className="font-semibold text-gray-700">Location:</span>{" "}
    //               <span className="text-gray-600">{course.live_detail.location}</span>
    //             </div>
    //           )}
    //           {course.live_detail.start_time && (
    //             <div>
    //               <span className="font-semibold text-gray-700">Start Time:</span>{" "}
    //               <span className="text-gray-600">{formatDate(course.live_detail.start_time)}</span>
    //             </div>
    //           )}
    //         </>
    //       )}
    //     </div>

    //     <div className="flex flex-col items-start md:items-end space-y-4">
    //       {course.supplementary_file && (
    //         <button
    //           onClick={handleDownload}
    //           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
    //         >
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             className="w-5 h-5"
    //             fill="currentColor"
    //             viewBox="0 0 16 16"
    //           >
    //             <path d="M.5 9.9V13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.9a.5.5 0 0 0-1 0V13H1.5V9.9a.5.5 0 0 0-1 0z" />
    //             <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.854 7.646a.5.5 0 1 0-.708.708l3.5 3.5z" />
    //           </svg>
    //           Download Supplementary Material
    //         </button>
    //       )}
    //     </div>
    //   </section>

    //   {/* Course Videos */}
    //   <section>
    //     <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Videos</h2>
    //     {videos && videos.length > 0 ? (
    //       <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         {videos.map((vid, index) => (
    //           <li
    //             key={index}
    //             className="p-4 border rounded hover:shadow-lg transition duration-200"
    //           >
    //             <Link to={`video/${index}`} className="block">
    //               <button className="w-full text-left text-blue-600 hover:underline font-medium">
    //                 {vid.video_title}
    //               </button>
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     ) : (
    //       <p className="text-gray-600">No videos available for this course.</p>
    //     )}
    //   </section>
    // </div>

    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Course Header */}
        <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="mb-6 flex items-center text-sm text-gray-500">
                  <Link to="/" className="hover:text-gray-700">Home</Link>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <Link to="/course" className="hover:text-gray-700">Courses</Link>
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
                    src={DefaultPic} 
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
                  <div className="flex flex-col">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.course_name}</h1>
                      <p className="text-lg text-gray-600 mb-6">{course.course_description}</p>

                      <div className="flex items-center mb-4">
                        <div className="flex-1 flex items-center">
                          <StarRating rating={course.ratings.average} size="lg" />
                          <span className="ml-2 text-muted-foreground">
                            ({course.ratings.totalReviews} reviews)
                          </span>
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
                          <span className="text-sm">{course.subject}</span>
                        </div>
                        <div className="flex items-center px-4 py-2 rounded-lg bg-gray-100">
                          <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{course.course_type}</span>
                        </div>
                      </div>
                      
                      {/* <div className="mt-auto flex flex-col sm:flex-row gap-4"> */}
                      <div className="flex space-x-4">
                        <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all sm:flex-1 flex justify-center items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Enroll Now
                        </button>
                        <button 
                        onClick={() => window.location.href = `/course/video/${courseId}`} 
                        className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-100 transition-colors sm:flex-1 flex justify-center items-center">
                          Preview Course
                        </button>
                      </div>
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
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">Student Reviews</h2>
                  <StarRating rating={course.ratings.average} size="md" />
                </div>
                
                <div className="space-y-4">

                {reviews && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))
              ) : (
                <p>No reviews available.</p>
              )}
                </div> 
                <div className="mt-6 text-center">
                  <button className="px-6 py-2 rounded-full border border-border hover:bg-secondary transition-colors text-sm">
                    View All Reviews
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="sticky top-30 rounded-xl bg-white border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-4">Course Details</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: <Clock className="w-5 h-5" />, label: 'Duration', value: course.course_length + ' ' + "Hrs"},
                      { icon: <Users className="w-5 h-5" />, label: 'Instructor', value: course.tutor.user.firstname + ' ' + course.tutor.user.lastname },
                      { icon: <GraduationCap className="w-5 h-5" />, label: 'Capacity', value: course.course_capacity + ' ' + "Persons" },
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
                  <h3 className="text-xl font-display font-bold mb-4">What You'll Learn</h3>
                  <ul className="space-y-3">
                    {/* {[
                      'Comprehensive understanding of key concepts',
                      'Practical skills for real-world application',
                      'Problem-solving techniques specific to the field',
                      'Best practices from industry experts',
                      'Portfolio-worthy projects and exercises'
                    ].map((item, idx) => (
                      <li key={idx} className="flex">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))} */}
                  </ul>
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
              to="/course" 
              className="group inline-flex items-center text-primary font-medium mt-4 md:mt-0"
            >
              View all courses
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCourses.map(course => (
              <CourseItem key={courseId} course={course} />
            ))}
          </div> */}
        </div>
      </section>
      
      {/* Footer */}
      {/* <footer className="bg-card border-t border-border py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="font-display font-bold text-xl mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  LearnConnect
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting passionate learners with expert tutors for transformative educational experiences.
              </p>
            </div>
            
            {[
              {
                title: 'Platform',
                links: ['Courses', 'Tutors', 'Community', 'Resources']
              },
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Blog', 'Contact']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Accessibility']
              }
            ].map((group, idx) => (
              <div key={idx}>
                <h4 className="font-medium mb-4">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2023 LearnConnect. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
    
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Loading...</h1>
    </div>
  );
};

export default Course;
