import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast'; // Import the toast function
import uploadIcon from '../assets/upload-icon.svg';

const FileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      // Trigger a success toast!
      toast.success(`File "${file.name}" selected successfully!`);
      // Here you would typically handle the file upload logic
    } else {
      // Trigger an error toast!
      toast.error('Please upload a valid CSV file.');
      setFileName('');
    }
  };

  // Drag and drop handlers remain the same
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  // This function is now called by the new button
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`file-uploader ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      // Note: The main div is no longer clickable
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
      <img src={uploadIcon} alt="Upload" className="upload-icon" />
      
      {fileName ? (
        <p className="file-name">Ready to process: {fileName}</p>
      ) : (
        <p>Drag and drop a CSV file here</p>
      )}

      {/* The new "fancy" button */}
      <button className="btn-primary" onClick={handleButtonClick}>
        Or Choose a File
      </button>

    </div>
  );
};

export default FileUploader;