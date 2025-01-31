import React, { useState } from "react";
import './CSS/CreateCourse.css';
import {
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
  FaBook,
} from "react-icons/fa";

const LiveClassForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    datetime: "",
    location: "",
    duration: "60",
    tags: [],
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
    if (!formData.datetime) newErrors.datetime = "Date/time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.tags.length === 0)
      newErrors.tags = "At least one tag is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Add API call here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
        Schedule a New Live Class <FaBook />
      </h2>
      <form onSubmit={handleSubmit}>
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

        <div className="form-row">
          <div className={`form-group ${errors.datetime ? "error" : ""}`}>
            <label>
              <FaCalendarAlt /> Date & Time
            </label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
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
            />
            {errors.location && (
              <span className="error-message">{errors.location}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              <FaClock /> Duration (minutes)
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>
        </div>

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

        <button type="submit" className="submit-btn">
          Schedule Class
        </button>
      </form>
    </div>
  );
};

// document.head.appendChild(document.createElement("style")).textContent = styles;

export default LiveClassForm;
