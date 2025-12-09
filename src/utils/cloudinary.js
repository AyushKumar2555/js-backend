import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import { env } from 'process';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// for debugging
// console.log("DEBUG CLOUDINARY CONFIG:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   hasSecret: !!process.env.CLOUDINARY_API_SECRET
// });

const uploadOnCLoudinary = async (localFilePath) => {

    // 🌟 DEBUG 1 — Function call
    // console.log("DEBUG: Upload function called. Path:", localFilePath);

    try {
        if(!localFilePath) {
            console.log("DEBUG: localFilePath missing, returning null");
            return null;
        }

        // 🌟 DEBUG 2 — Before uploading
        // console.log("DEBUG: Starting Cloudinary upload...");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // 🌟 DEBUG 3 — Upload success
        // console.log("DEBUG: Cloudinary upload success. URL:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {

        // 🌟 DEBUG 4 — Upload failed
  /*
        console.log("DEBUG: Cloudinary upload failed!");
        console.log("DEBUG Error Message:", error.message);
        console.log("DEBUG Full Error Object:", error);
*/
        try {
            fs.unlinkSync(localFilePath);
            console.log("DEBUG: Local temp file deleted after error.");
        } catch (unlinkErr) {
            console.log("DEBUG: Failed to delete local temp file.", unlinkErr.message);
        }

        return null;
    }
}

export {uploadOnCLoudinary}
