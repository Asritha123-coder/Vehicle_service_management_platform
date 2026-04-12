import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.CLOUDINARY_URL;

if (url) {
    // Manually parse CLOUDINARY_URL because auto-detection can fail in ESM
    // Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    try {
        const parts = url.split('://')[1];
        const [auth, cloudName] = parts.split('@');
        const [apiKey, apiSecret] = auth.split(':');
        
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });
        console.log("Cloudinary manually configured for cloud:", cloudName);
    } catch (err) {
        console.error("Error parsing CLOUDINARY_URL:", err.message);
    }
} else {
    console.error("CLOUDINARY_URL is missing from environment variables.");
}

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "vehicles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

export default upload;