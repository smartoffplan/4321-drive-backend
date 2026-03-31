const { PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const s3 = require("../../config/s3");
const logger = require("../../utils/logger");

/**
 * Uploads a single image to S3
 */
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;
    const ext = file.originalname.split(".").pop();
    const fileName = `vehicles/${crypto.randomUUID()}.${ext}`;

    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    if (!bucketName || !region) {
      throw new Error("AWS configuration missing: AWS_BUCKET_NAME or AWS_REGION");
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    logger.info(`Image uploaded to S3: ${imageUrl}`);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Image uploaded successfully",
      data: {
        imageUrl,
        key: fileName,
      },
    });
  } catch (error) {
    logger.error(`S3 Upload Error: ${error.message}`);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error during upload",
      error: error.message,
    });
  }
};
