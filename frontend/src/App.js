import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, converting, completed, error
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setStatus('idle');
    setError(null);
    setDownloadUrl(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setStatus('uploading');
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFileId(data.fileId);
      setDownloadFilename(data.filename);
      handleConvert(data.fileId, data.filename);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const handleConvert = async (id, filename) => {
    setStatus('converting');
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId: id, filename })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      setStatus('completed');
      setDownloadUrl(`${API_BASE_URL}${data.downloadUrl}`);
      setDownloadFilename(data.filename);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileId(null);
    setStatus('idle');
    setDownloadUrl(null);
    setError(null);
    setDownloadFilename('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video to MP3 Converter</h1>
        <p>Convert your video files to MP3 audio format</p>
      </header>

      <main className="App-main">
        <div className="converter-container">
          {status === 'idle' && (
            <>
              <FileUpload onFileSelect={handleFileSelect} selectedFile={file} />

              {file && (
                <div className="file-info">
                  <div className="file-details">
                    <span className="file-icon">🎬</span>
                    <div>
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button className="convert-btn" onClick={handleUpload}>
                    Convert to MP3
                  </button>
                </div>
              )}
            </>
          )}

          {status === 'uploading' && (
            <div className="status-container">
              <div className="spinner"></div>
              <h3>Uploading file...</h3>
              <p>Please wait while we upload your video</p>
            </div>
          )}

          {status === 'converting' && (
            <div className="status-container">
              <div className="spinner"></div>
              <h3>Converting to MP3...</h3>
              <p>This may take a few moments depending on file size</p>
            </div>
          )}

          {status === 'completed' && (
            <div className="status-container success">
              <div className="success-icon">✓</div>
              <h3>Conversion Complete!</h3>
              <p>Your MP3 file is ready to download</p>
              <div className="action-buttons">
                <button className="download-btn" onClick={handleDownload}>
                  Download MP3
                </button>
                <button className="reset-btn" onClick={handleReset}>
                  Convert Another File
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="status-container error">
              <div className="error-icon">✕</div>
              <h3>Error</h3>
              <p>{error}</p>
              <button className="reset-btn" onClick={handleReset}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Supports MP4, AVI, MOV, MKV, FLV, WMV, WebM, and more</p>
      </footer>
    </div>
  );
}

export default App;
