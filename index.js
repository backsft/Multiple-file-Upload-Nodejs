const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Create a storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The 'uploads' directory where files will be saved
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.array('files', 5), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFiles = req.files.map((file) => file.filename);
  res.status(200).send('Files uploaded: ' + uploadedFiles.join(', '));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
