import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (cloudinaryUrl) => {
  if (!cloudinaryUrl) return;

  try {
    // Extract public_id from Cloudinary URL
    const publicId = cloudinaryUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export { deleteFromCloudinary };
