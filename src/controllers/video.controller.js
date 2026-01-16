import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    
    const filter = {};
    
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    
    if (userId) {
        filter.owner = new mongoose.Types.ObjectId(userId);
    }
    
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    } else {
        sortOptions.createdAt = -1;
    }
    
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortOptions,
        populate: "owner"
    };
    
    const videos = await Video.paginate(filter, options);
    
    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    
    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }
    
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
    if (!videoFile) {
        throw new ApiError(500, "Failed to upload video file");
    }
    
    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }
    
    const video = await Video.create({
        videoFile: {
            url: videoFile.url,
            publicId: videoFile.public_id
        },
        thumbnail: {
            url: thumbnail.url,
            publicId: thumbnail.public_id
        },
        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    });
    
    const createdVideo = await Video.findById(video._id).populate("owner", "username avatar");
    
    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).populate("owner", "username avatar");
    
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    // Add to user's watch history
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $addToSet: { watchHistory: videoId }
        }
    );
    
    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own videos");
    }
    
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    
    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (thumbnail) {
            // Delete old thumbnail from Cloudinary
            if (video.thumbnail.publicId) {
                await deleteFromCloudinary(video.thumbnail.publicId);
            }
            updateFields.thumbnail = {
                url: thumbnail.url,
                publicId: thumbnail.public_id
            };
        }
    }
    
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true }
    ).populate("owner", "username avatar");
    
    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own videos");
    }
    
    // Delete from Cloudinary
    if (video.videoFile.publicId) {
        await deleteFromCloudinary(video.videoFile.publicId, "video");
    }
    
    if (video.thumbnail.publicId) {
        await deleteFromCloudinary(video.thumbnail.publicId);
    }
    
    // Delete from database
    await Video.findByIdAndDelete(videoId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only toggle publish status of your own videos");
    }
    
    video.isPublished = !video.isPublished;
    await video.save();
    
    const status = video.isPublished ? "published" : "unpublished";
    
    return res.status(200).json(
        new ApiResponse(200, video, `Video ${status} successfully`)
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};