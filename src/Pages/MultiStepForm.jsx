import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MultiStepForm = ({ onClose }) => {
  const navigate = useNavigate();
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
    duration: "60",       // For live courses
    courseLength: "",     // For video courses
  });
  const [errors, setErrors] = useState({});

  // For tag functionality
  const [inputTag, setInputTag] = useState("");
  const availableTags = ["Math", "Science", "Programming", "Art", "Language", "Music"];

  const handleTagAdd = () => {
    if (inputTag && !formData.tags.includes(inputTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, inputTag] }));
      setInputTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      supplementaryFile: e.target.files[0],
    }));
  };

  const validateCurrentStep = () => {
    let newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      }
      if (formData.tags.length === 0) {
        newErrors.tags = "At least one tag is required";
      }
    }

    if (currentStep === 2) {
      if (formData.isVideoCourse) {
        if (!formData.videoLink.trim()) {
          newErrors.videoLink = "Video link is required";
        }
      } else {
        if (!formData.datetime) {
          newErrors.datetime = "Date & Time is required";
        }
        if (!formData.location.trim()) {
          newErrors.location = "Location is required";
        }
      }
    }

    if (currentStep === 3) {
      if (!formData.price) {
        newErrors.price = "Price is required";
      }
      if (!formData.isVideoCourse && !formData.maxStudents) {
        newErrors.maxStudents = "Max Students is required";
      }
      if (formData.isVideoCourse && !formData.courseLength) {
        newErrors.courseLength = "Course Length is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
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
    courseData.append("t_email", "tutor@example.com");
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
        body: courseData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Course Created Successfully!");
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
        navigate("/mycourse");
      } else {
        alert(`Failed to create course: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating course");
    }
  };

  // Render content for each step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Information</h2>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter class title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.title && <span className="text-red-500 text-sm mt-1 block">{errors.title}</span>}
            </div>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter class description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 resize-vertical"
              />
              {errors.description && <span className="text-red-500 text-sm mt-1 block">{errors.description}</span>}
            </div>
            <div className={`form-group mb-4 ${errors.tags ? "border border-red-500 p-2 rounded" : ""}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags:</label>
              <div className="flex items-center gap-2">
                <select
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Add Tag
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-200 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => handleTagRemove(tag)} className="ml-1 text-red-500">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              {errors.tags && <span className="text-red-500 text-sm mt-1 block">{errors.tags}</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {formData.isVideoCourse ? "Video Course Details" : "Schedule Details"}
            </h2>
            <div className="form-group mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isVideoCourse"
                  checked={formData.isVideoCourse}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Video-Based Course</span>
              </label>
            </div>
            {formData.isVideoCourse ? (
              <div className="form-group mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Link:</label>
                <input
                  type="text"
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  placeholder="Enter YouTube link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.videoLink && <span className="text-red-500 text-sm mt-1 block">{errors.videoLink}</span>}
              </div>
            ) : (
              <>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time:</label>
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {errors.datetime && <span className="text-red-500 text-sm mt-1 block">{errors.datetime}</span>}
                </div>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {errors.location && <span className="text-red-500 text-sm mt-1 block">{errors.location}</span>}
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Course Information</h2>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplementary File:</label>
              <input
                type="file"
                name="supplementaryFile"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                className="w-full text-sm text-gray-700"
              />
            </div>
            {!formData.isVideoCourse && (
              <div className="form-group mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Students:</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  placeholder="Enter max number of students"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.maxStudents && <span className="text-red-500 text-sm mt-1 block">{errors.maxStudents}</span>}
              </div>
            )}
            {formData.isVideoCourse && (
              <div className="form-group mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Length (minutes):</label>
                <input
                  type="number"
                  name="courseLength"
                  value={formData.courseLength}
                  onChange={handleChange}
                  placeholder="Enter video length in minutes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                {errors.courseLength && <span className="text-red-500 text-sm mt-1 block">{errors.courseLength}</span>}
              </div>
            )}
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter course price"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.price && <span className="text-red-500 text-sm mt-1 block">{errors.price}</span>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Review & Confirm</h2>
            <div className="review text-gray-700">
              <p className="mb-2"><strong>Class Title:</strong> {formData.title}</p>
              <p className="mb-2"><strong>Class Description:</strong> {formData.description}</p>
              <p className="mb-2"><strong>Tags:</strong> {formData.tags.join(", ")}</p>
              <p className="mb-2"><strong>Course Type:</strong> {formData.isVideoCourse ? "Video" : "Live"}</p>
              {formData.isVideoCourse ? (
                <p className="mb-2"><strong>Video Link:</strong> {formData.videoLink}</p>
              ) : (
                <>
                  <p className="mb-2"><strong>Date & Time:</strong> {formData.datetime}</p>
                  <p className="mb-2"><strong>Location:</strong> {formData.location}</p>
                </>
              )}
              {!formData.isVideoCourse && (
                <p className="mb-2"><strong>Max Students:</strong> {formData.maxStudents || "N/A"}</p>
              )}
              {formData.isVideoCourse && (
                <p className="mb-2"><strong>Course Length:</strong> {formData.courseLength || "N/A"}</p>
              )}
              <p className="mb-2"><strong>Price:</strong> {formData.price}</p>
              <p className="mb-2">
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Progress Bar */}
      <div className="flex justify-between mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}>1</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}>2</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}>3</div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 4 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}>4</div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Back
            </button>
          )}
          {currentStep < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Next
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
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
