const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all routes
router.use(authMiddleware);

// Upload single file
router.post("/upload", upload.single("file"), fileController.uploadFile);

// Delete file
router.delete("/:fileKey", fileController.deleteFile);

// Get file URL
router.get("/:fileKey", fileController.getFileUrl);

module.exports = router;
