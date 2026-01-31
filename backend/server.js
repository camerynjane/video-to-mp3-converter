const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads and outputs directories
const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const videoFormats = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm', '.m4v'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (videoFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    fileId: path.parse(req.file.filename).name,
    filename: req.file.originalname,
    path: req.file.path
  });
});

// Conversion endpoint
app.post('/api/convert', (req, res) => {
  const { fileId, filename } = req.body;

  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  // Find the uploaded file
  const files = fs.readdirSync(uploadsDir);
  const uploadedFile = files.find(f => f.startsWith(fileId));

  if (!uploadedFile) {
    return res.status(404).json({ error: 'File not found' });
  }

  const inputPath = path.join(uploadsDir, uploadedFile);
  const outputFilename = `${fileId}.mp3`;
  const outputPath = path.join(outputsDir, outputFilename);

  // Convert video to MP3 using FFmpeg
  ffmpeg(inputPath)
    .toFormat('mp3')
    .audioCodec('libmp3lame')
    .audioBitrate('192k')
    .on('start', (commandLine) => {
      console.log('FFmpeg command:', commandLine);
    })
    .on('progress', (progress) => {
      console.log(`Processing: ${progress.percent}% done`);
    })
    .on('end', () => {
      console.log('Conversion finished');

      // Clean up input file
      fs.unlinkSync(inputPath);

      res.json({
        success: true,
        downloadUrl: `/api/download/${outputFilename}`,
        filename: `${path.parse(filename || 'audio').name}.mp3`
      });
    })
    .on('error', (err) => {
      console.error('Error during conversion:', err);

      // Clean up files on error
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

      res.status(500).json({ error: 'Conversion failed', details: err.message });
    })
    .save(outputPath);
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(outputsDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error('Download error:', err);
    } else {
      // Clean up file after download
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }, 1000);
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
