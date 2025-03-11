import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/MultiStepForm.css";

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

  // Add a tag if one is selected and not already added
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

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // File input change handler
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      supplementaryFile: e.target.files[0],
    }));
  };

  // Validate current step required fields
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

  // Navigation handlers
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Final validation for steps 1-3
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
    // Append tags as a JSON string (or adjust as needed)
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
        // Optionally reset the form:
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
        onClose(); // Close the modal after successful submission
        navigate("/mycourse");
      } else {
        alert(`Failed to create course: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating course");
    }
  };

  // Render the content for each step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>General Information</h2>
            <div className="form-group">
              <label>Class Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter class title"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Class Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter class description"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            <div className={`form-group ${errors.tags ? "error" : ""}`}>
              <label>Tags:</label>
              <div className="tag-input">
                <select
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                >
                  <option value="">Select a tag</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleTagAdd} className="add-tag-btn">
                  Add Tag
                </button>
              </div>
              <div className="tags-container">
                {formData.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => handleTagRemove(tag)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.tags && <span className="error-message">{errors.tags}</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>{formData.isVideoCourse ? "Video Course Details" : "Schedule Details"}</h2>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isVideoCourse"
                  checked={formData.isVideoCourse}
                  onChange={handleChange}
                />
                Video-Based Course
              </label>
            </div>
            {formData.isVideoCourse ? (
              <div className="form-group">
                <label>Video Link:</label>
                <input
                  type="text"
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  placeholder="Enter YouTube link"
                />
                {errors.videoLink && <span className="error-message">{errors.videoLink}</span>}
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Date & Time:</label>
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                  />
                  {errors.datetime && <span className="error-message">{errors.datetime}</span>}
                </div>
                <div className="form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Additional Course Information</h2>
            <div className="form-group">
              <label>Supplementary File:</label>
              <input
                type="file"
                name="supplementaryFile"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              />
            </div>
            {!formData.isVideoCourse && (
              <div className="form-group">
                <label>Max Students:</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  placeholder="Enter max number of students"
                />
                {errors.maxStudents && <span className="error-message">{errors.maxStudents}</span>}
              </div>
            )}
            {formData.isVideoCourse && (
              <div className="form-group">
                <label>Course Length (minutes):</label>
                <input
                  type="number"
                  name="courseLength"
                  value={formData.courseLength}
                  onChange={handleChange}
                  placeholder="Enter video length in minutes"
                />
                {errors.courseLength && <span className="error-message">{errors.courseLength}</span>}
              </div>
            )}
            <div className="form-group">
              <label>Price (USD):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter course price"
                min="0"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2>Review & Confirm</h2>
            <div className="review">
              <p><strong>Class Title:</strong> {formData.title}</p>
              <p><strong>Class Description:</strong> {formData.description}</p>
              <p>
                <strong>Tags:</strong> {formData.tags.join(", ")}
              </p>
              <p>
                <strong>Course Type:</strong> {formData.isVideoCourse ? "Video" : "Live"}
              </p>
              {formData.isVideoCourse ? (
                <p><strong>Video Link:</strong> {formData.videoLink}</p>
              ) : (
                <>
                  <p><strong>Date & Time:</strong> {formData.datetime}</p>
                  <p><strong>Location:</strong> {formData.location}</p>
                </>
              )}
              {!formData.isVideoCourse && (
                <p><strong>Max Students:</strong> {formData.maxStudents || "N/A"}</p>
              )}
              {formData.isVideoCourse && (
                <p><strong>Course Length:</strong> {formData.courseLength || "N/A"}</p>
              )}
              <p><strong>Price:</strong> {formData.price}</p>
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
    <div className="multi-step-form-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
        <div className={`step ${currentStep >= 4 ? "active" : ""}`}>4</div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="button-group">
          {currentStep > 1 && (
            <button type="button" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < 4 && (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          )}
          {currentStep === 4 && <button type="submit">Submit</button>}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
