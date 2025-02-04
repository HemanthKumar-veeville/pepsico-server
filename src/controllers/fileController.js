const fileService = require("../services/fileService");

class FileController {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file provided",
        });
      }

      const result = await fileService.uploadFile(req.file);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const { fileKey } = req.params;
      await fileService.deleteFile(fileKey);

      res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getFileUrl(req, res) {
    try {
      const { fileKey } = req.params;
      const url = await fileService.getFileUrl(fileKey);

      res.status(200).json({
        success: true,
        data: { url },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new FileController();
