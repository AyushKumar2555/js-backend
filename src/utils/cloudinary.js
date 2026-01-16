import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Cloudinary Config Check:");
console.log("- Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("- API Key:", process.env.CLOUDINARY_API_KEY);
console.log("- Has Secret:", !!process.env.CLOUDINARY_API_SECRET);

const uploadOnCloudinary = async (localFilePath) => {
    console.log("Upload function called with path:", localFilePath);
    
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("File does not exist:", localFilePath);
            return null;
        }

        console.log("File exists, size:", fs.statSync(localFilePath).size, "bytes");
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("Upload successful:", response.url);
        
        // Delete local file
        fs.unlinkSync(localFilePath);
        console.log("Local file deleted");
        
        return response;

    } catch (error) {
        console.log("Cloudinary upload ERROR:", error.message);
        
        // Try to delete local file
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log("Local file deleted after error");
            }
        } catch (unlinkErr) {
            console.log("Failed to delete local file:", unlinkErr.message);
        }
        
        return null;
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) {
            console.log("No public ID provided for deletion");
            return null;
        }

        console.log(`Deleting from Cloudinary: ${publicId} (type: ${resourceType})`);
        
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        console.log("Delete successful:", result);
        return result;

    } catch (error) {
        console.log("Cloudinary delete ERROR:", error.message);
        return null;
    }
};

// Export BOTH functions
export { uploadOnCloudinary, deleteFromCloudinary };