const cloudinary = require("cloudinary");
const fs = require("fs");

const UploadCloudinary = async (filePath) => {
    // Configure
    cloudinary.config({
        cloud_name: `${process.env.CLOUD_NAME}`,
        api_key: `${process.env.CLOUD_API_KEY}`,
        api_secret: `${process.env.CLOUD_API_SECRET}`
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;
    }

    catch (err) {
        console.log("UploadCloudinary Error :", err.message);
        fs.unlinkSync(filePath);
    }
}

module.exports = UploadCloudinary