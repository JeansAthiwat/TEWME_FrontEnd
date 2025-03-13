import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getCourse = async () => {
      const response = await fetch(`http://localhost:39189/course/${courseId}`);
      const data = await response.json();
      setCourse(data);
    };
    getCourse();
  }, [courseId]);

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
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded space-y-6">
      {/* Header */}
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{course.course_name}</h1>
        {course.course_description && (
          <p className="mt-2 text-lg text-gray-600">{course.course_description}</p>
        )}
      </header>

      {/* Detailed Course Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {course.subject && (
            <div>
              <span className="font-semibold text-gray-700">Subject:</span>{" "}
              <span className="text-gray-600">{course.subject}</span>
            </div>
          )}
          <div>
            <span className="font-semibold text-gray-700">Price:</span>{" "}
            <span className="text-gray-600">${course.price.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Course Length:</span>{" "}
            <span className="text-gray-600">{course.course_length} hours</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Capacity:</span>{" "}
            <span className="text-gray-600">{course.course_capacity} students</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span className="text-gray-600">{course.session_status}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Course Type:</span>{" "}
            <span className="text-gray-600">{course.course_type}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created Date:</span>{" "}
            <span className="text-gray-600">{formatDate(course.created_date)}</span>
          </div>
          {course.tags && course.tags.length > 0 && (
            <div>
              <span className="font-semibold text-gray-700">Tags:</span>{" "}
              <span className="text-gray-600">{course.tags.join(", ")}</span>
            </div>
          )}
          {course.live_detail && course.course_type === "Live" && (
            <>
              {course.live_detail.location && (
                <div>
                  <span className="font-semibold text-gray-700">Location:</span>{" "}
                  <span className="text-gray-600">{course.live_detail.location}</span>
                </div>
              )}
              {course.live_detail.start_time && (
                <div>
                  <span className="font-semibold text-gray-700">Start Time:</span>{" "}
                  <span className="text-gray-600">{formatDate(course.live_detail.start_time)}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col items-start md:items-end space-y-4">
          {course.supplementary_file && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9V13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.9a.5.5 0 0 0-1 0V13H1.5V9.9a.5.5 0 0 0-1 0z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.854 7.646a.5.5 0 1 0-.708.708l3.5 3.5z" />
              </svg>
              Download Supplementary Material
            </button>
          )}
        </div>
      </section>

      {/* Course Videos */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Videos</h2>
        {videos && videos.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((vid, index) => (
              <li
                key={index}
                className="p-4 border rounded hover:shadow-lg transition duration-200"
              >
                <Link to={`video/${index}`} className="block">
                  <button className="w-full text-left text-blue-600 hover:underline font-medium">
                    {vid.video_title}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No videos available for this course.</p>
        )}
      </section>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Loading...</h1>
    </div>
  );
};

export default Course;
