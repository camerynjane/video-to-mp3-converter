import React, { useState, useRef } from 'react';
import './FileUpload.css';

function FileUpload({ onFileSelect, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
      const file = files[0];
      validateAndSelectFile(file);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const validateAndSelectFile = (file) => {
    const videoFormats = [
      'video/mp4',
      'video/x-msvideo', // avi
      'video/quicktime', // mov
      'video/x-matroska', // mkv
      'video/x-flv', // flv
      'video/x-ms-wmv', // wmv
      'video/webm',
      'video/x-m4v'
    ];

    if (!videoFormats.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|flv|wmv|webm|m4v)$/i)) {
      alert('Please select a valid video file');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      alert('File size must be less than 500MB');
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-wrapper">
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,.mp4,.avi,.mov,.mkv,.flv,.wmv,.webm,.m4v"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div className="dropzone-content">
          <div className="upload-icon">
            {selectedFile ? '✓' : '📁'}
          </div>
          <h3>
            {selectedFile
              ? 'File Selected'
              : isDragging
              ? 'Drop file here'
              : 'Drag & drop your video here'}
          </h3>
          <p>
            {selectedFile
              ? 'Click to choose a different file'
              : 'or click to browse files'}
          </p>
          <div className="format-hint">
            Supports: MP4, AVI, MOV, MKV, FLV, WMV, WebM
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
