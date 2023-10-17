const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.fields([
  { name: 'photo', maxCount: 5 },
  { name: 'passport', maxCount: 5 },
  { name: 'certificates', maxCount: 5 }
]), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedPhotos = req.files['photo'].map((file) => file.filename);
  const uploadedPassports = req.files['passport'].map((file) => file.filename);
  const uploadedCertificates = req.files['certificates'].map((file) => file.filename);

  res.status(200).send('Files uploaded: Photos - ' + uploadedPhotos.join(', ') + ', Passports - ' + uploadedPassports.join(', ') + ', Certificates - ' + uploadedCertificates.join(', '));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
