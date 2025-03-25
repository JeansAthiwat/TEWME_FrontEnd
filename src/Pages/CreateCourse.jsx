import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./CSS/CreateCourse.css";
import {
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
  FaBook,
  FaVideo,
  FaLink,
} from "react-icons/fa";

const LiveClassForm = ({email}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    datetime: "",
    location: "",
    duration: "60",
    tags: [],
    isVideoCourse: false,
    videoLink: "",
    price: "",
    courseLength: "",
    maxStudents: "",
    supplementaryFile: null, // New field for file upload
  });

  const [errors, setErrors] = useState({});
  const [inputTag, setInputTag] = useState("");
  const [availableTags] = useState([
    "Math",
    "Science",
    "Programming",
    "Art",
    "Language",
    "Music",
  ]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";

    if (formData.isVideoCourse) {
      if (!formData.videoLink.trim()) {
        newErrors.videoLink = "Video link is required";
      } else if (
        !formData.videoLink.match(
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
        )
      ) {
        newErrors.videoLink = "Invalid YouTube link";
      }
    } else {
      if (!formData.datetime) newErrors.datetime = "Date/time is required";
      if (!formData.location.trim())
        newErrors.location = "Location is required";
    }

    if (formData.tags.length === 0)
      newErrors.tags = "At least one tag is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Use FormData to include file uploads
        const courseData = new FormData();
        courseData.append("course_name", formData.title);
        courseData.append("course_description", formData.description);
        courseData.append("subject", formData.tags.join(", "));
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
        courseData.append(
          "course_type",
          formData.isVideoCourse ? "Video" : "Live"
        );
        courseData.append("t_email", email);
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
        // Append the supplementary file if one was selected
        if (formData.supplementaryFile) {
          courseData.append("supplementaryFile", formData.supplementaryFile);
        }

        const response = await fetch("http://localhost:39189/course", {
          method: "POST",
          body: courseData,
        });
        console.log(courseData)
        const data = await response.json();
        if (response.ok) {
          // alert("Course Created Successfully!");
          console.log("Created Course:", data);
          setFormData({
            title: "",
            description: "",
            datetime: "",
            location: "",
            duration: "60",
            tags: [],
            isVideoCourse: false,
            videoLink: "",
            courseLength: "",
            maxStudents: "",
            price: "",
            supplementaryFile: null,
          });
          navigate("/mycourse");
        } else {
          alert(`Failed to create course: ${data.message}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error creating course");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // If user unchecks video course, clear video link
    if (name === "isVideoCourse" && !checked) {
      setFormData((prev) => ({ ...prev, videoLink: "" }));
    }
  };

  // Handle file input changes separately
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      supplementaryFile: e.target.files[0],
    }));
  };

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

  return (
    <div className="class-form-container">
      <h2>
        Schedule a New Course <FaBook />
      </h2>
      <div className="go-to-mycourses">
        <Link to="/mycourse" className="mycourses-link">
          Go to My Courses
        </Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={`form-group ${errors.title ? "error" : ""}`}>
          <label>
            <FaBook /> Class Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter class title"
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            <FaBook /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed class description..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <div className="form-group">
            <label className="video-checkbox">
              <input
                type="checkbox"
                name="isVideoCourse"
                checked={formData.isVideoCourse}
                onChange={handleChange}
                className="video-checkbox-input"
              />
              <FaVideo /> Video-Based Course
            </label>
          </div>
        </div>

        {formData.isVideoCourse ? (
          <div className={`form-group ${errors.videoLink ? "error" : ""}`}>
            <label>
              <FaLink /> YouTube Video Link
            </label>
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="Enter YouTube link"
            />
            {errors.videoLink && (
              <span className="error-message">{errors.videoLink}</span>
            )}
          </div>
        ) : (
          <>
            <div className={`form-group ${errors.datetime ? "error" : ""}`}>
              <label>
                <FaCalendarAlt /> Date & Time
              </label>
              <input
                type="datetime-local"
                name="datetime"
                min={new Date().toISOString().split("T")[0]}
                value={formData.datetime}
                onChange={handleChange}
                disabled={formData.isVideoCourse}
                className="datetime-input"
              />
              {errors.datetime && (
                <span className="error-message">{errors.datetime}</span>
              )}
            </div>

            <div className={`form-group ${errors.location ? "error" : ""}`}>
              <label>
                <FaMapMarkerAlt /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Physical or online location"
                disabled={formData.isVideoCourse}
              />
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>
          </>
        )}

        <div className={`form-group ${errors.tags ? "error" : ""}`}>
          <label>
            <FaTag /> Tags
          </label>
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
            <button
              type="button"
              onClick={handleTagAdd}
              className="add-tag-btn"
            >
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

        {/* Supplementary File Upload Field */}
        <div className="form-group">
          <label>
            Supplementary File (PDF, DOC, DOCX, PPT, PPTX, ZIP)
          </label>
          <input
            type="file"
            name="supplementaryFile"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
            onChange={handleFileChange}
          />
        </div>

        {/* Course Length (Only for Video-Based Courses) */}
        {formData.isVideoCourse && (
          <div className={`form-group ${errors.courseLength ? "error" : ""}`}>
            <label>🎬 Course Length (Minutes)</label>
            <input
              type="number"
              name="courseLength"
              value={formData.courseLength}
              onChange={handleChange}
              placeholder="Enter video length in minutes"
              min="1"
              className="course-length-input"
            />
            {errors.courseLength && (
              <span className="error-message">{errors.courseLength}</span>
            )}
          </div>
        )}

        {/* Max Students (Only for Live Classes) */}
        {!formData.isVideoCourse && (
          <div className={`form-group ${errors.maxStudents ? "error" : ""}`}>
            <label>👥 Max Students</label>
            <input
              type="number"
              name="maxStudents"
              value={formData.maxStudents}
              onChange={handleChange}
              placeholder="Enter max students"
              className="max-students-input"
            />
            {errors.maxStudents && (
              <span className="error-message">{errors.maxStudents}</span>
            )}
          </div>
        )}

        <div className={`form-group ${errors.price ? "error" : ""}`}>
          <label>💰 Price (USD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter course price"
            min="0"
            className="price-input"
          />
          {errors.price && (
            <span className="error-message">{errors.price}</span>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Schedule Course
        </button>
      </form>
    </div>
  );
};

export default LiveClassForm;
