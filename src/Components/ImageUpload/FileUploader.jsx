import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Adjust the URL to match your backend's upload endpoint
      const response = await axios.post('http://localhost:39189/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>File Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploader;