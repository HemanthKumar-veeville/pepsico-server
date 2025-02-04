const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

class FileService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFile(file) {
    try {
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const params = {
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await this.s3.upload(params).promise();

      return {
        url: uploadResult.Location,
        key: uploadResult.Key,
        fileName: file.originalname,
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(fileKey) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: fileKey,
      };

      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  async getFileUrl(fileKey) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: fileKey,
        Expires: 604800, // URL expires in 7 days
      };

      const url = await this.s3.getSignedUrlPromise("getObject", params);
      return url;
    } catch (error) {
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }
}

module.exports = new FileService();
