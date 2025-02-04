const multer = require("multer");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function to validate file types
const fileFilter = (req, file, cb) => {
  // Accept all file types
  // You can add specific validations here if needed
  cb(null, true);
};

// Configure multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  },
});

module.exports = upload;
