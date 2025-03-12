import React, { useState } from "react";
import VideoUploadModal from "./VideoUploadModal";

const CreateCoursePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <h1>Create a Video Course</h1>
      <button onClick={() => setModalIsOpen(true)}>
        Upload Video
      </button>
      <VideoUploadModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};

export default CreateCoursePage;
