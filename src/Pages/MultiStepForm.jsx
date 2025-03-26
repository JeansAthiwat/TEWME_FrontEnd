import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/MultiStepForm.css";

const MultiStepForm = ({ setCourses, tutorID, tEmail, onClose }) => {
  const [tutorId, setTutorId] = useState(tutorID);
  const navigate = useNavigate();

  // Fetch tutor ID if not provided as a prop
  useEffect(() => {
    if (!tutorID) {
      const fetchTutorId = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");
          const response = await fetch("http://localhost:39189/api/profile/get-profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error("Failed to fetch tutor profile");
          }
          const data = await response.json();
          setTutorId(data._id); // set tutorId with the valid ObjectId
        } catch (error) {
          console.error("Error fetching tutor ID:", error.message);
        }
      };
      fetchTutorId();
    } else {
      setTutorId(tutorID);
    }
  }, [tutorID]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    isVideoCourse: false,
    videoLink: "",
    datetime: "",
    location: "",
    supplementaryFile: null,
    maxStudents: "",
    price: "",
    duration: "60", // For live courses
    courseLength: "", // For video courses
  });
  const [errors, setErrors] = useState({});
  const [inputTag, setInputTag] = useState("");
  const availableTags = ["Math", "Science", "Programming", "Art", "Language", "Music"];

  // --- Tag Handlers ---
  const handleTagAdd = () => {
    if (inputTag && !formData.tags.includes(inputTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, inputTag] }));
      setInputTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  // --- Input Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      supplementaryFile: e.target.files[0]
    }));
  };

  // --- Validation ---
  const validateCurrentStep = () => {
    let newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (formData.tags.length === 0) newErrors.tags = "At least one tag is required";
    }

    if (currentStep === 2) {
      if (formData.isVideoCourse) {
        if (!formData.videoLink.trim()) newErrors.videoLink = "Video link is required";
      } else {
        if (!formData.datetime) newErrors.datetime = "Date & Time is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
      }
    }

    if (currentStep === 3) {
      if (!formData.price) newErrors.price = "Price is required";
      if (!formData.isVideoCourse && !formData.maxStudents)
        newErrors.maxStudents = "Max Students is required";
      if (formData.isVideoCourse && !formData.courseLength)
        newErrors.courseLength = "Course Length is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Navigation Handlers ---
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    if (!tutorId) {
      alert("Tutor ID is missing. Please try again later.");
      return;
    }

    const courseData = new FormData();
    courseData.append("course_name", formData.title);
    courseData.append("course_description", formData.description);
    courseData.append("price", formData.price);
    courseData.append(
      "course_length",
      formData.isVideoCourse ? formData.courseLength : formData.duration
    );
    courseData.append(
      "course_capacity",
      formData.isVideoCourse ? 999 : formData.maxStudents
    );
    courseData.append("session_status", "Schedule");
    courseData.append("is_publish", true);
    courseData.append("course_type", formData.isVideoCourse ? "Video" : "Live");
    courseData.append("t_email", tEmail);
    courseData.append("tutor", tutorId);
    courseData.append("tags", JSON.stringify(formData.tags));

    if (!formData.isVideoCourse) {
      courseData.append("live_detail[location]", formData.location);
      courseData.append("live_detail[start_time]", formData.datetime);
    }
    if (formData.isVideoCourse) {
      courseData.append("videos[0][video_id]", formData.videoLink);
      courseData.append("videos[0][video_title]", formData.title);
      courseData.append("videos[0][video_urls]", formData.videoLink);
    }
    if (formData.supplementaryFile) {
      courseData.append("supplementaryFile", formData.supplementaryFile);
    }
    try {
      const response = await fetch("http://localhost:39189/course", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: courseData,
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          tags: [],
          isVideoCourse: false,
          videoLink: "",
          datetime: "",
          location: "",
          supplementaryFile: null,
          maxStudents: "",
          price: "",
          duration: "60",
          courseLength: "",
        });
        onClose();
        setCourses((prev) => [...prev, data]);
      } else {
        alert(`Failed to create course: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating course");
    }
  };

  // --- Render Step Content ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900 text-left">
              General Information
            </h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Class Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter class title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Class Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter class description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 resize-y"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                >
                  <option value="">Select a tag</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900 text-left">
              Course Type:{" "}
              {formData.isVideoCourse ? "Video Course Details" : "Schedule Details"}
            </h3>
            <div className="inline-flex rounded-md shadow-xs mb-4" role="group">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isVideoCourse: true }))
                }
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  formData.isVideoCourse
                    ? "bg-blue-700 text-white"
                    : "bg-white text-blue-700"
                } border border-blue-700 rounded-l-lg hover:bg-blue-800 hover:text-white focus:z-10 focus:ring-2 focus:ring-blue-500`}
              >
                Video-Based Course
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isVideoCourse: false }))
                }
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  !formData.isVideoCourse
                    ? "bg-blue-700 text-white"
                    : "bg-white text-blue-700"
                } border border-blue-700 rounded-r-lg hover:bg-blue-800 hover:text-white focus:z-10 focus:ring-2 focus:ring-blue-500`}
              >
                Live Course
              </button>
            </div>
            {formData.isVideoCourse ? (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Video Link
                </label>
                <input
                  type="text"
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  placeholder="Enter YouTube link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                />
                {errors.videoLink && (
                  <p className="text-red-500 text-sm mt-1">{errors.videoLink}</p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="datetime"
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.datetime}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  />
                  {errors.datetime && (
                    <p className="text-red-500 text-sm mt-1">{errors.datetime}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900 text-left">
              Additional Course Information
            </h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Supplementary File
              </label>
              <input
                type="file"
                name="supplementaryFile"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              />
            </div>
            {!formData.isVideoCourse && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Max Students
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  placeholder="Enter max number of students"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                />
                {errors.maxStudents && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>
                )}
              </div>
            )}
            {formData.isVideoCourse && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Course Length (minutes)
                </label>
                <input
                  type="number"
                  name="courseLength"
                  value={formData.courseLength}
                  onChange={handleChange}
                  placeholder="Enter video length in minutes"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                />
                {errors.courseLength && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseLength}</p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Price (USD)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter course price"
                min="0"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900 text-left">
              Review & Confirm
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Class Title:</strong> {formData.title}
              </p>
              <p>
                <strong>Class Description:</strong> {formData.description}
              </p>
              <p>
                <strong>Tags:</strong> {formData.tags.join(", ")}
              </p>
              <p>
                <strong>Course Type:</strong> {formData.isVideoCourse ? "Video" : "Live"}
              </p>
              {formData.isVideoCourse ? (
                <p>
                  <strong>Video Link:</strong> {formData.videoLink}
                </p>
              ) : (
                <>
                  <p>
                    <strong>Date & Time:</strong> {formData.datetime}
                  </p>
                  <p>
                    <strong>Location:</strong> {formData.location}
                  </p>
                </>
              )}
              {!formData.isVideoCourse && (
                <p>
                  <strong>Max Students:</strong> {formData.maxStudents || "N/A"}
                </p>
              )}
              {formData.isVideoCourse && (
                <p>
                  <strong>Course Length:</strong> {formData.courseLength || "N/A"}
                </p>
              )}
              <p>
                <strong>Price:</strong> {formData.price}
              </p>
              <p>
                <strong>Supplementary File:</strong>{" "}
                {formData.supplementaryFile ? formData.supplementaryFile.name : "None"}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6 bg-white">
      <ol className="flex items-center w-full text-sm font-medium text-left text-gray-500 dark:text-gray-400 sm:text-base">
        <li
          className={`flex md:w-full items-center ${
            currentStep >= 1 ? "text-blue-600 dark:text-blue-500" : "text-gray-500"
          } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            {currentStep > 1 ? (
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            ) : (
              <span className="me-2">1</span>
            )}
            General Info
          </span>
        </li>
        <li
          className={`flex md:w-full items-center ${
            currentStep >= 2 ? "text-blue-600 dark:text-blue-500" : "text-gray-500"
          } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            {currentStep > 2 ? (
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            ) : (
              <span className="me-2">2</span>
            )}
            Schedule / Video
          </span>
        </li>
        <li
          className={`flex md:w-full items-center ${
            currentStep >= 3 ? "text-blue-600 dark:text-blue-500" : "text-gray-500"
          } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            {currentStep > 3 ? (
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            ) : (
              <span className="me-2">3</span>
            )}
            Additional Info
          </span>
        </li>
        <li
          className={`flex items-center ${
            currentStep >= 4 ? "text-blue-600 dark:text-blue-500" : "text-gray-500"
          }`}
        >
          <span className="flex items-center">
            <span className="me-2">4</span>
            Review & Confirm
          </span>
        </li>
      </ol>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Back
            </button>
          )}
          {currentStep < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Next
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="submit"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
