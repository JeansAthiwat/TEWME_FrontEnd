import React, { useState } from "react";
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

// Add these styles to your CSS
const styles = `
.class-form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

input, textarea, select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus, select:focus {
  border-color: #3498db;
  outline: none;
}

.tag-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.add-tag-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-tag-btn:hover {
  background: #2980b9;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #3498db15;
  color: #3498db;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.tag button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
}

.submit-btn {
  background: #27ae60;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #219a52;
}

.error input, .error select, .error textarea {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: block;
}
`;

document.head.appendChild(document.createElement("style")).textContent = styles;

export default LiveClassForm;
