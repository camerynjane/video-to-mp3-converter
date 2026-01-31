# Video to MP3 Converter

A full-stack web application that converts video files to MP3 audio format. Built with React frontend and Node.js backend using FFmpeg for conversion.

## Features

- **Drag & Drop Upload**: Intuitive drag-and-drop interface for file uploads
- **File Picker**: Traditional file browser for selecting videos
- **Real-time Status**: Visual feedback during upload and conversion
- **Multiple Formats**: Supports MP4, AVI, MOV, MKV, FLV, WMV, WebM, and more
- **Automatic Download**: Direct download of converted MP3 files
- **File Validation**: Client and server-side validation for file types and sizes
- **Clean UI**: Modern, responsive design inspired by FreeConvert

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **FFmpeg** - Required for video conversion

### Installing FFmpeg

#### macOS (using Homebrew):
```bash
brew install ffmpeg
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows:
1. Download FFmpeg from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract and add to PATH
3. Or use Chocolatey: `choco install ffmpeg`

Verify installation:
```bash
ffmpeg -version
```

## Installation

1. **Clone or navigate to the project directory:**
```bash
cd video-to-mp3-converter
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

## Running the Application

You'll need to run both the backend and frontend servers.

### Start the Backend Server

In the `backend` directory:
```bash
npm start
```

The backend will run on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

### Start the Frontend Server

In a new terminal, navigate to the `frontend` directory:
```bash
npm start
```

The frontend will open automatically at `http://localhost:3000`

## Usage

1. **Upload a Video**:
   - Drag and drop a video file onto the upload area, OR
   - Click the upload area to browse and select a file

2. **Convert**:
   - Click "Convert to MP3" button
   - Wait for the upload and conversion process to complete

3. **Download**:
   - Once conversion is complete, click "Download MP3"
   - Your MP3 file will be downloaded automatically

4. **Convert Another**:
   - Click "Convert Another File" to start over

## Technical Details

### Backend Stack
- **Express.js**: Web server framework
- **Multer**: File upload middleware
- **Fluent-FFmpeg**: FFmpeg wrapper for Node.js
- **CORS**: Cross-origin resource sharing

### Frontend Stack
- **React**: UI library
- **Axios**: HTTP client
- **CSS3**: Styling with gradients and animations

### API Endpoints

- `POST /api/upload` - Upload video file
- `POST /api/convert` - Convert video to MP3
- `GET /api/download/:filename` - Download converted MP3
- `GET /api/health` - Health check endpoint

## File Size Limits

- Maximum file size: **500MB**
- Files are automatically cleaned up after download

## Supported Video Formats

- MP4
- AVI
- MOV
- MKV
- FLV
- WMV
- WebM
- M4V

## Project Structure

```
video-to-mp3-converter/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   ├── uploads/           # Temporary video storage (auto-created)
│   └── outputs/           # Converted MP3 storage (auto-created)
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js    # Drag-drop component
│   │   │   └── FileUpload.css   # Upload component styles
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Application styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## Troubleshooting

### FFmpeg not found
**Error**: `ffmpeg: command not found` or similar

**Solution**: Install FFmpeg and ensure it's in your system PATH

### CORS errors
**Error**: Cross-origin request blocked

**Solution**: Make sure the backend is running on port 5000 and CORS is enabled

### Port already in use
**Error**: Port 3000 or 5000 already in use

**Solution**: Kill the process using the port or change the port in the configuration

### File upload fails
**Error**: Upload or conversion fails

**Solution**:
- Check file size (must be < 500MB)
- Verify file format is supported
- Check FFmpeg is installed correctly

## Development

To run in development mode with auto-reload:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

This creates an optimized build in the `frontend/build` directory.

## License

This project is open source and available for educational purposes.

## Credits

Inspired by [FreeConvert.com](https://www.freeconvert.com/convert/video-to-mp3)
