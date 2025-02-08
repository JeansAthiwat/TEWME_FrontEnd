import React, { use, useState } from 'react'
import './ImageUpload.css'

const ImageUpload = () => {
    const [file, setFile] = useState()
    const [error, setError] = useState("")

    function getFile(event){
        const selectedFile = event.target.files[0]

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!validTypes.includes(selectedFile?.type)) {
            setError("Please select only PNG or JPG images")
            return
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            setError("File size should be less than 2MB")
            return
        }

        setError("")
        setFile(URL.createObjectURL(selectedFile))
    }

    const handleDelete = () => {
        setFile(null)
        setError("")
    }
  return (
     <div className='image-upload-container'>
            <input type="file" onChange={getFile} accept=".png,.jpg,.jpeg"/>
            {error && <p className="error-message">{error}</p>}
            {file && (
                <div className="image-preview">
                    <img src={file} alt="Preview" />
                    {/* <button onClick={handleDelete} className="delete-button">x</button> */}
                </div>
            )}
     </div>
  )
}

export default ImageUpload
