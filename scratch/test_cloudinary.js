import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve('server/.env') });

console.log("Cloudinary URL present:", !!process.env.CLOUDINARY_URL);

cloudinary.config({
    secure: true
});

console.log("Cloudinary Config Cloud Name:", cloudinary.config().cloud_name);

if (!cloudinary.config().cloud_name) {
    console.log("Cloudinary Config failed to pick up environment variable.");
} else {
    console.log("Cloudinary Config successful.");
}
